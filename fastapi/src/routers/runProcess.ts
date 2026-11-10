import { execFile } from "child_process";

// command: ["program", "arg1", "arg2"]
export function runQuery(command: string[]): Promise<string> {
  const [cmd, ...args] = command;
  return new Promise((resolve) => {
    execFile(cmd, args, { encoding: "utf8" }, (err, stdout) => {
      if (err && !stdout) {
        resolve(command.join(" "));
        return;
      }
      resolve(stdout);
    });
  });
}