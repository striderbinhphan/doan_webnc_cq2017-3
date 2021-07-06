const db = require('../utils/db');

module.exports = {
    
    addNewSections(sections){
        return db('sections').insert([...sections]);
    }
}