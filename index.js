#! /usr/bin/env node

const { spawn } = require('child_process');

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
    return console.log(`
  Invalid directory name.
  Usage: create-express-api name-of-api  
`);
}

const repoURL = 'https://github.com/th1m0/ts-discordjs-template.git';

runCommand('git', ['clone', repoURL, name])
    .then(() => {
        return runCommand('rm', ['-r', `${name}/.git`]);
    }).then(() => {
        console.log('Installing dependencies...');
        return runCommand('npm', ['install'], {
            cwd: process.cwd() + '/' + name
        });
    }).then(() => {
        console.log("Moving into your project.")
        return runCommand("cd", [name], {
            cwd: process.cwd() + "/" + name
        });

    }).then(() => {
        console.log("Run\n\nnpm run dev\n\nTo start developing your app!")
    })

function runCommand(command, args, options = undefined) {
    const spawned = spawn(command, args, options);

    return new Promise((resolve) => {
        spawned.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        spawned.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        spawned.on('close', () => {
            resolve();
        });
    });
}