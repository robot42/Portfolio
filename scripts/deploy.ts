import { Client, type AccessOptions, type FileInfo } from "basic-ftp";
import path from "node:path";
import { mkdir, readdir, stat } from "node:fs/promises";

const PROJECT_ROOT = process.cwd();
const SITE_HOST = "ehuettig42.de";
const FTP_USER = "torstek_0";
const FTP_PASSWORD = process.env.FTP_PASSWORD ?? "REPLACE_WITH_PASSWORD";

// Default: explicit FTPS on port 21. For implicit FTPS, set FTP_PORT to 990
// and FTP_SECURE to "implicit", or run with FTP_PORT=990 FTP_SECURE=implicit.
const FTP_PORT = Number(process.env.FTP_PORT ?? 21);
const FTP_SECURE: AccessOptions["secure"] =
  process.env.FTP_SECURE === "implicit" ? "implicit" : true;

const REMOTE_ROOT = "/";
const SIDE_PROJECTS_DIR = "side-projects";
const BACKUP_ROOT = path.join(PROJECT_ROOT, "backups");
const ROOT_FILE_EXTENSIONS = new Set([".html", ".css", ".jpg", ".png"]);

type LocalFile = {
  relativePath: string;
  localPath: string;
  remotePath: string;
};

type LocalState = {
  files: LocalFile[];
  directories: Set<string>;
};

type RemoteFile = {
  relativePath: string;
  remotePath: string;
  info: FileInfo;
};

type RemoteState = {
  files: Map<string, RemoteFile>;
  directories: Set<string>;
};

type Options = {
  dryRun: boolean;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const localState = await collectLocalState();

  printLocalSummary(localState, options);

  if (options.dryRun) {
    return;
  }

  if (FTP_PASSWORD === "REPLACE_WITH_PASSWORD") {
    throw new Error(
      'FTP password is still the placeholder. Replace "REPLACE_WITH_PASSWORD" in scripts/deploy.ts or run with FTP_PASSWORD=your-password npm run deploy.',
    );
  }

  const client = new Client(30_000);
  client.ftp.verbose = process.env.FTP_VERBOSE === "1";

  try {
    console.log(`Connecting to ${SITE_HOST}:${FTP_PORT} with FTPS...`);
    await client.access({
      host: SITE_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: FTP_SECURE,
    });

    const remoteState = await collectRemoteState(client);
    const backupDir = await backupRemoteState(client, remoteState);
    console.log(`Backup completed: ${path.relative(PROJECT_ROOT, backupDir)}`);

    await deleteRemoteEntriesNotInLocalState(client, remoteState, localState);
    await ensureRemoteDirectories(client, localState.directories);
    await uploadLocalFiles(client, localState.files);

    console.log("Deployment completed.");
  } finally {
    client.close();
  }
}

function parseArgs(args: string[]): Options {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage:
  npm run deploy
  npm run deploy:dry-run

Environment:
  FTP_PASSWORD=...       Use a password without editing this script.
  FTP_PORT=990           Switch to implicit FTPS port when needed.
  FTP_SECURE=implicit    Use implicit FTPS instead of explicit FTPS.
  FTP_VERBOSE=1          Print FTP protocol details for debugging.`);
    process.exit(0);
  }

  const allowedArgs = new Set(["--dry-run"]);
  const unknownArgs = args.filter((arg) => !allowedArgs.has(arg));
  if (unknownArgs.length > 0) {
    throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  }

  return {
    dryRun: args.includes("--dry-run"),
  };
}

async function collectLocalState(): Promise<LocalState> {
  const files: LocalFile[] = [];
  const directories = new Set<string>();

  const rootEntries = await readdir(PROJECT_ROOT, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (!entry.isFile() || !isManagedRootFile(entry.name)) {
      continue;
    }
    files.push(toLocalFile(entry.name));
  }

  const sideProjectsPath = path.join(PROJECT_ROOT, SIDE_PROJECTS_DIR);
  const sideProjectsStat = await stat(sideProjectsPath);
  if (!sideProjectsStat.isDirectory()) {
    throw new Error(`${SIDE_PROJECTS_DIR} exists but is not a directory.`);
  }

  directories.add(SIDE_PROJECTS_DIR);
  await collectLocalDirectory(sideProjectsPath, SIDE_PROJECTS_DIR, files, directories);

  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  return {
    files,
    directories,
  };
}

async function collectLocalDirectory(
  localDirectory: string,
  relativeDirectory: string,
  files: LocalFile[],
  directories: Set<string>,
): Promise<void> {
  const entries = await readdir(localDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const localPath = path.join(localDirectory, entry.name);

    if (entry.isDirectory()) {
      directories.add(relativePath);
      await collectLocalDirectory(localPath, relativePath, files, directories);
      continue;
    }

    if (entry.isFile()) {
      files.push(toLocalFile(relativePath));
      continue;
    }

    console.warn(`Skipping unsupported local entry: ${relativePath}`);
  }
}

function toLocalFile(relativePath: string): LocalFile {
  return {
    relativePath,
    localPath: path.join(PROJECT_ROOT, ...relativePath.split("/")),
    remotePath: toRemotePath(relativePath),
  };
}

async function collectRemoteState(client: Client): Promise<RemoteState> {
  const files = new Map<string, RemoteFile>();
  const directories = new Set<string>();
  const rootEntries = await client.list(REMOTE_ROOT);

  for (const entry of rootEntries) {
    if (entry.name === "." || entry.name === "..") {
      continue;
    }

    if (isRemoteFileLike(entry) && isManagedRootFile(entry.name)) {
      const relativePath = entry.name;
      files.set(relativePath, {
        relativePath,
        remotePath: toRemotePath(relativePath),
        info: entry,
      });
      continue;
    }

    if (entry.isDirectory && entry.name === SIDE_PROJECTS_DIR) {
      directories.add(SIDE_PROJECTS_DIR);
      await collectRemoteDirectory(
        client,
        toRemotePath(SIDE_PROJECTS_DIR),
        SIDE_PROJECTS_DIR,
        files,
        directories,
      );
    }
  }

  return {
    files,
    directories,
  };
}

async function collectRemoteDirectory(
  client: Client,
  remoteDirectory: string,
  relativeDirectory: string,
  files: Map<string, RemoteFile>,
  directories: Set<string>,
): Promise<void> {
  const entries = await client.list(remoteDirectory);

  for (const entry of entries) {
    if (entry.name === "." || entry.name === "..") {
      continue;
    }

    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const remotePath = toRemotePath(relativePath);

    if (entry.isDirectory) {
      directories.add(relativePath);
      await collectRemoteDirectory(client, remotePath, relativePath, files, directories);
      continue;
    }

    if (isRemoteFileLike(entry)) {
      files.set(relativePath, {
        relativePath,
        remotePath,
        info: entry,
      });
    }
  }
}

async function backupRemoteState(client: Client, remoteState: RemoteState): Promise<string> {
  const backupDir = path.join(BACKUP_ROOT, `${SITE_HOST}-${formatTimestamp(new Date())}`);
  await mkdir(backupDir, { recursive: true });

  for (const relativeDirectory of sortDirectoriesForCreate(remoteState.directories)) {
    await mkdir(path.join(backupDir, ...relativeDirectory.split("/")), { recursive: true });
  }

  const remoteFiles = [...remoteState.files.values()].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath),
  );

  for (const file of remoteFiles) {
    const backupPath = path.join(backupDir, ...file.relativePath.split("/"));
    await mkdir(path.dirname(backupPath), { recursive: true });
    console.log(`[backup] ${file.remotePath}`);
    await client.downloadTo(backupPath, file.remotePath);
  }

  return backupDir;
}

async function deleteRemoteEntriesNotInLocalState(
  client: Client,
  remoteState: RemoteState,
  localState: LocalState,
): Promise<void> {
  const localFiles = new Set(localState.files.map((file) => file.relativePath));

  const filesToDelete = [...remoteState.files.values()]
    .filter((file) => !localFiles.has(file.relativePath))
    .sort((a, b) => b.relativePath.localeCompare(a.relativePath));

  for (const file of filesToDelete) {
    console.log(`[delete file] ${file.remotePath}`);
    await client.remove(file.remotePath);
  }

  const directoriesToDelete = [...remoteState.directories]
    .filter((directory) => directory !== SIDE_PROJECTS_DIR)
    .filter((directory) => !localState.directories.has(directory))
    .sort((a, b) => directoryDepth(b) - directoryDepth(a));

  for (const directory of directoriesToDelete) {
    const remotePath = toRemotePath(directory);
    console.log(`[delete directory] ${remotePath}`);
    await client.removeDir(remotePath);
  }
}

async function ensureRemoteDirectories(
  client: Client,
  localDirectories: Set<string>,
): Promise<void> {
  for (const relativeDirectory of sortDirectoriesForCreate(localDirectories)) {
    const remotePath = toRemotePath(relativeDirectory);
    console.log(`[ensure directory] ${remotePath}`);
    await client.ensureDir(remotePath);
  }
  await client.cd(REMOTE_ROOT);
}

async function uploadLocalFiles(client: Client, localFiles: LocalFile[]): Promise<void> {
  for (const file of localFiles) {
    console.log(`[upload] ${file.remotePath}`);
    await client.uploadFrom(file.localPath, file.remotePath);
  }
}

function printLocalSummary(localState: LocalState, options: Options): void {
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log(`Managed local files: ${localState.files.length}`);
  console.log(`Managed local directories: ${localState.directories.size}`);

  if (options.dryRun) {
    console.log("Dry run only. No FTP connection, backup, upload, or deletion will run.");
    for (const file of localState.files) {
      console.log(`[managed] ${file.relativePath}`);
    }
  }
}

function isManagedRootFile(fileName: string): boolean {
  return ROOT_FILE_EXTENSIONS.has(path.posix.extname(fileName).toLowerCase());
}

function isRemoteFileLike(entry: FileInfo): boolean {
  return entry.isFile || entry.isSymbolicLink;
}

function toRemotePath(relativePath: string): string {
  return path.posix.join(REMOTE_ROOT, relativePath);
}

function sortDirectoriesForCreate(directories: Set<string>): string[] {
  return [...directories].sort((a, b) => directoryDepth(a) - directoryDepth(b) || a.localeCompare(b));
}

function directoryDepth(directory: string): number {
  return directory.split("/").length;
}

function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
