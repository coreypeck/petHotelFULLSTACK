var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mywork';

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query('DELETE FROM pets ' +
            'WHERE id = $1', [id],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            });
    });
});

router.get('/owners', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM owners', function(err, result) {
            done(); // closes connection, I only have 10!

            if (err) {
                res.sendStatus(500);
            }

            res.send(result.rows);
        });
    });
});


router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM owners JOIN pets ON owners.id = pets.pet_owner', function(err, result) {
            done(); // closes connection, I only have 10!

            if (err) {
                res.sendStatus(500);
            }

            res.send(result.rows);
        });
    });
});

router.post('/petdetails', function(req, res) {
    var pet = req.body;
    console.log(req.body);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO pets (pet_name, pet_breed, pet_color, pet_owner) ' +
            'VALUES ($1, $2, $3, $4)', [pet.pet_name, pet.pet_breed, pet.pet_color, pet.pet_owner],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });
});

router.post('/owners', function(req, res) {
    var owner = req.body;
    console.log(req.body);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO owners (owner_firstname, owner_lastname) ' +
            'VALUES ($1, $2)', [owner.owner_firstname, owner.owner_lastname],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    var pet = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log("error is here");
            res.sendStatus(500);
        }
        client.query('UPDATE pets SET pet_name = $1, pet_breed = $2, pet_color = $3 WHERE id = $4', [pet.pet_name, pet.pet_breed, pet.pet_color, id],
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                    console.log("Error in pg.connect:", err);
                } else {
                    res.sendStatus(200);
                }
            });

    });

});

module.exports = router;
