describe('Queries and reference', function() {
	
	var sys_user1
	var app, myclass 
	var appUser1, appUser2
	

	// system user login and create application
  before(function(done) {
  	this.timeout(25000)
  	R.Promisify(factories.create('login_system_user'))
    .then(function(res) {
      sys_user1 = res.body.user
    })
    .then(function(res) {
    	return R.Promisify(factories.create('Create_application', sys_user1.authtoken))
    })
    .then(function(res) {
    	app = res.body.application
    })
    .then(function(res) {
    	return factories.create('create_objects', 2, sys_user1.authtoken, app.api_key, 'built_io_application_user', [{
				"published": true,
				"active": true,
				"username": "userOne",
				"email": "userOne@mailinator.com",
				"password": "raw123",
				"password_confirmation": "raw123"
			},{
				"published": true,
				"active": true,
				"username": "userTwo",
				"email": "userTwo@mailinator.com",
				"password": "raw123",
				"password_confirmation": "raw123"
			}])
		})
		.then(function(res) {
			return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, 'built_io_application_user'))
		})
		.then(function(res) {
			user1 = res.body.objects[0]
			user2 = res.body.objects[1]
		})
		.then(function(res) {
			return R.Promisify(factories.create('login_app_user', app.api_key, {
			  "application_user": {
			    "email": user1.email,
			    "password": "raw123"
			  }
			}))
		})
		.then(function(res) {
			appUser1 = res.body.application_user
		})
		.then(function(res) {
			return R.Promisify(factories.create('login_app_user', app.api_key, {
			  "application_user": {
			    "email": user2.email,
			    "password": "raw123"
			  }
			}))
		})
		.then(function(res) {
			appUser2 = res.body.application_user
		})
    .then(function(res) {
      done()
    })
    .catch(function(err) {
      console.log(err.trace)
    })

	})
  
  // delete application
  after(function(done) {
    factories.create('Delete_application', sys_user1.authtoken, app.api_key)
    .end(function(err, res) {
      // console.log("application delete")
      done(err)
    })

  })


  describe('Get objects Queries', function() {
  	
  	this.timeout(45000)
  	before(function(done) {
			R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
					"title": "book",
					"uid": "book",
					"schema": [{
						"uid": "author",
						"data_type": "text",
						"display_name": "author",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}, {
						"uid": "bookname",
						"data_type": "text",
						"display_name": "bookname",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}, {
						"uid": "address",
						"data_type": "group",
						"display_name": "address",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						},
						"schema": [{
							"uid": "city",
							"data_type": "text",
							"display_name": "city",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}, {
							"uid": "state",
							"data_type": "text",
							"display_name": "state",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"format": "",
							"unique": null,
							"action": "add",
							"field_metadata": {
								"allow_rich_text": false,
								"multiline": false
							}
						}]
					}, {
						"uid": "daysold",
						"data_type": "number",
						"display_name": "daysold",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"action": "add",
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}],
					"DEFAULT_ACL": {
						"others": {
							"create": true,
							"read": true
						},
						"roles": [],
						"users": []
					}
				}
			}))
			.then(function(res) {
				myclass = res.body.class
			})
			.then(function(res) {
				return factories.create('create_objects', 6, sys_user1.authtoken, app.api_key, myclass.uid, [{
					"author": "swapnil",
					"bookname": "FTJ",
					"address": {
						"city": "virar",
						"state": "maharastra"
					},
					"daysold": "100"
				},{
					"author": "swapnil",
					"bookname": "PTMS",
					"address": {
						"city": "Gorai",
						"state": "hydrabad"
					},
					"daysold": "160"
				},{
					"author": "pratick",
					"bookname": "PSY",
					"address": {
						"city": "anjuna",
						"state": "goa"
					},
					"daysold": "130"
				},{
					"author": "chetan",
					"bookname": "Life of psy",
					"address": {
						"city": "esky",
						"state": "shanti jatra"
					},
					"daysold": "90"
				},{
					"author": "suyog",
					"bookname": "medical man",
					"address": {
						"city": "ajmer",
						"state": "rajastan"
					},
					"daysold": "125"
				},{
					"author": "ashvin",
					"bookname": "music man",
					"address": {
						"city": "charkop",
						"state": "mumbai"
					},
					"daysold": "135"
				}])
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })

		})	


  	it('should get object using simple query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass.uid, {
			 "query": {
			    "author": "swapnil"
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.author.should.be.equal('swapnil')
				object.bookname.should.be.equal('FTJ')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});

  	
  	it('should get object using regex in query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, {
			 	"query": {
			    "author": {
			      "$regex": "^chet",
			      "$options": "i"
			    }
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.author.should.be.equal('chetan')
				object.bookname.should.be.equal('Life of psy')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using query on simple group field', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, {
			 	"query": {
		    	"address.city": "anjuna"  
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.author.should.be.equal('pratick')
				// object.bookname.should.be.equal('Life of psy')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it.skip('should get object using $or query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, {
				"query": {
					"$or": [{
						"author": {
							"$regex": "^chetan",
							"$options": "i"
						}
					}, {
						"bookname": {
							"$regex": "^FTJ",
							"$options": "i"
						}
					}]
				}
			}))
			.then(function(res) {
				console.log(res.body)
				// object = R.last(res.body.objects)
				// object.author.should.be.equal('chetan')
				// object.bookname.should.be.equal('Life of psy')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it.only('should get object using $or query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, {
				"query": {
					"$or": [{
						"author": {
							"$regex": "^chetan",
							"$options": "i"
						}
					}, {
						"bookname": {
							"$regex": "^FTJ",
							"$options": "i"
						}
					}]
				}
			}))
			.then(function(res) {
				console.log(res.body)
				// object = R.last(res.body.objects)
				// object.author.should.be.equal('chetan')
				// object.bookname.should.be.equal('Life of psy')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});






  });













});