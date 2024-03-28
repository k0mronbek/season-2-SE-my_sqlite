const MySqliteRequest = require('./MySqliteRequest.js');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

function mainFunc(p1) {
    let request = new MySqliteRequest();
    let stringValue = "";
    if (p1.includes("VALUES")) {
        stringValue = p1.split('VALUES')[1].trim();
    }
    let tokens = p1.split(" ");
    let dataName = "";
    for (let i = 0; i < tokens.length; i++) {
        switch(tokens[i].toUpperCase()) {
            case "SELECT":
                let tmp = tokens[i+1].includes(",") ? tokens[i+1].split(",") : tokens[i+1];
                request = request.select(tmp);
                break;
            case "FROM":
                request = request.from(tokens[i+1]);
                break;
            case "WHERE":
                let whereCondition = p1.split("WHERE").pop().split("=").map(elem => elem.trim());
                request = request.where(whereCondition[0], whereCondition[1].replace(/^'|'$/, ''));
                break;
            case "INSERT":
                if (tokens[i+1].toUpperCase() === "INTO") {
                    i += 2;
                    dataName = tokens[i];
                    request = request.insert(tokens[i]);
                }
                break;
            case "UPDATE":
                request = request.update(tokens[i+1]);
                break;
            case "DELETE":
                request = request.delete();
                break;
            case "VALUES":
                i += 1;
                const contents = fs.readFileSync(dataName, 'utf8').split("\n")[0] + "\n" + stringValue.replace(/[()]/g, '');
                const hashName = parse(contents, {columns: true}).map(row => row);
                request = request.values(hashName[0]);
                break;
            case "SET":
                i += 1;
                let temp = "";
                let ind = i;
                while (tokens[ind].toUpperCase() !== "WHERE") {
                    temp += tokens[ind] + " ";
                    ind += 1;
                }
                const hash = {};
                temp.match(/(\w+)\s*=\s*'([^']+)'/g).forEach(match => {
                    const [key, value] = match.split(/\s*=\s*/).map(elem => elem.replace(/^'|'$/, ''));
                    hash[key] = value;
                });
                request = request.values(hash);
                break;
        }
    }
    request.run();
}

console.log("my_sqlite_cli>");
process.stdin.on('data', function(data) {
    const str = data.toString().trim();
    if (str.includes("quit")) {
        process.exit();
    } else {
        mainFunc(str);
        console.log("my_sqlite_cli>");
    }
});