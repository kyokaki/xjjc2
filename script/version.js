// version.js
const execSync = require('child_process').execSync;
const fs = require('fs');

// 获取git信息的相关命令
const COMMITHASH_COMMAND = 'rev-parse HEAD';
const VERSION_COMMAND = 'describe --always';
const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';
try {
  const d = new Date();
  const versionStr =`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HealthCheck</title>
</head>
<body>
<p>
  Revision: ${execSync(`git ${COMMITHASH_COMMAND}`)}
  <br/>
  Branch: ${execSync(`git ${BRANCH_COMMAND}`)}
  <br/>
  Name: ${execSync('git show -s --format=%cn').toString().trim()}
  <br/>
  Message: ${execSync('git show -s --format=%s').toString().trim()}
  <br/>
  CommitDate: ${execSync('git show -s --format=%cd')}
  <br/>
  Release: ${execSync(`git ${VERSION_COMMAND}`)}
  <br/>
  X-PackingTime: ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}
</p>
</body>
</html>
        `;
  fs.writeFileSync(`dist/subapps/dev-ops-h5/HealthCheck.html`, versionStr);
} catch (e) {
  throw new Error(e);
}
