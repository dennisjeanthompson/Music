const { db } = require('./db');

class Track {
  static getAll({ page, search, startDate, endDate, itemsPerPage }) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM items WHERE 1=1';
      let params = [];

      if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
      }

      if (startDate) {
        query += ' AND date_created >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND date_created <= ?';
        params.push(endDate);
      }

      const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
      
      db.get(countQuery, params, (err, row) => {
        if (err) return reject(err);

        const totalItems = row.count;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const offset = (page - 1) * itemsPerPage;

        db.all(
          `${query} ORDER BY date_created DESC LIMIT ? OFFSET ?`,
          [...params, itemsPerPage, offset],
          (err, tracks) => {
            if (err) return reject(err);
            resolve({ tracks, totalPages, totalItems });
          }
        );
      });
    });
  }

  static add(name, description) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [name, description],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static update(id, name, description) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        [name, description, id],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM items WHERE id = ?', id, function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
}

module.exports = Track;