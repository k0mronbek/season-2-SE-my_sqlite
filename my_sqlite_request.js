const fs = require('fs');
const parse = require('csv-parse');
const stringify = require('csv-stringify');

class MySqliteRequest {
    constructor() {
        this.requireType = "";
        this.tableName = "";
        this.colName = [];
        this.whereColumn = {};
        this.value = {};
    }

    static from(tableName) {
        const instance = new this();
        instance.tableName = tableName;
        return instance;
    }

    where(p1, p2) {
        this.whereColumn[p1] = p2;
        return this;
    }

    select(...p1) {
        this.colName = p1;
        this.requireType = "select";
        return this;
    }

    update(p1) {
        this.tableName = p1;
        this.requireType = "update";
        return this;
    }

    insert(tableName) {
        this.tableName = tableName;
        this.requireType = "insert";
        return this;
    }

    delete() {
        this.requireType = "delete";
        return this;
    }

    values(p1) {
        this.value = p1;
        return this;
    }

}