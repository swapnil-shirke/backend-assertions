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
					"options": {
						"inbuiltFields": {
							"publish": true,
						}
					},
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
				return factories.create('create_objects', 6, appUser1.authtoken, app.api_key, myclass.uid, [{
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


  	it('should get object using $or query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
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
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object1.author.should.be.equal('chetan')
				object2.bookname.should.be.equal('FTJ')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $and query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
				"query": {
					"$and": [{
						"author": {
							"$regex": "^chetan",
							"$options": "i"
						}
					}, {
						"daysold": 90
					}]
				}
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.author.should.be.equal('chetan')
				object.bookname.should.be.equal('Life of psy')
				object.daysold.should.be.equal(90)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $lt(less then) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$lt": 125
			    }
			  }
			}))
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object1.daysold.should.be.equal(90)
				object2.daysold.should.be.equal(100)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $lte(less then or equal to) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$lte": 125
			    }
			  }
			}))
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				object1.daysold.should.be.equal(125)
				object2.daysold.should.be.equal(90)
				object3.daysold.should.be.equal(100)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $gt(greater than) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$gt": 125
			    }
			  }
			}))
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				object1.daysold.should.be.equal(135)
				object2.daysold.should.be.equal(130)
				object3.daysold.should.be.equal(160)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $gte(greater than or equal to) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$gte": 130
			    }
			  }
			}))
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				object1.daysold.should.be.equal(135)
				object2.daysold.should.be.equal(130)
				object3.daysold.should.be.equal(160)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $ne(not equal to) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$ne": 130
			    }
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)

				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				object4 = res.body.objects[3]
				object5 = res.body.objects[4]
				
				object1.daysold.should.be.equal(135)
				object2.daysold.should.be.equal(125)
				object3.daysold.should.be.equal(90)
				object4.daysold.should.be.equal(160)
				object5.daysold.should.be.equal(100)
				
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $in(contained In) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$in": [130, 125, 90]
			    }
			  }
			}))
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				
				object1.daysold.should.be.equal(125)
				object2.daysold.should.be.equal(90)
				object3.daysold.should.be.equal(130)
				
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $in(not contained In) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "daysold": {
			      "$nin": [130, 125, 90]
			    }
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)

				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
				object3 = res.body.objects[2]
				
				object1.daysold.should.be.equal(135)
				object2.daysold.should.be.equal(160)
				object3.daysold.should.be.equal(100)
				
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get object using $exists(exists) operators', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			 	"query": {
			    "bookname": {
			      "$exists": true
			    }
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.bookname.should.be.equal('FTJ')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get objects and include owner', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			  "_method": "get",
			  "include_owner": true
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				Object.keys(object).should.to.be.deep.equal(['author','bookname','address','daysold','app_user_object_uid','created_at','updated_at','uid','published','ACL','__loc','_version','created_by','updated_by','tags','_owner'])
				Object.keys(object._owner).should.to.be.deep.equal(['published','username','email','app_user_object_uid','created_by','updated_by','created_at','updated_at','uid','active','ACL','__loc','_version','tags','last_login_at'])
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get objects and include count', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			  "_method": "get",
			  "include_count": true
			}))
			.then(function(res) {
				res.body.count.should.be.equal(6)
				res.body.objects.length.should.be.equal(6)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  	it('should get objects and include schema', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser2.authtoken, app.api_key, myclass.uid, '', {
			  "_method": "get",
			  "include_schema": true
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				Object.keys(res.body).should.to.be.deep.equal(['objects','schema'])
				res.body.schema[0].uid.should.be.equal('author')
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});



  	it('should get objects and include unpublished', function(done) {
  		R.Promisify(factories.create('Create_object', sys_user1.authtoken, app.api_key, myclass.uid, {
					"object": {
						"name": "one",
						"published": false
					}
				}))
  		.then(function(res) {
  			// console.log(res.body)
  		})
  		.then(function(res) {
	  		return R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass.uid, '', {
				  "_method": "get",
				  "include_unpublished": true
				}))
  		})
			.then(function(res) {
				// R.pretty(res.body)
				object = res.body.objects[0]
				Object.keys(object).should.to.be.deep.equal(['published','app_user_object_uid','created_by','updated_by','created_at','updated_at','uid','ACL','__loc','_version','tags'])
				object.published.should.be.equal(false)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })


  	});


  

  });




	describe('Reference objects', function() {

		var myclass1, myclass2

  	
  	before(function(done) {
  		this.timeout(45000)
			R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
				"class": {
					"title": "project",
					"uid": "project",
					"inbuilt_class": false,
					"schema": [{
						"uid": "name",
						"data_type": "text",
						"display_name": "name",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}, {
						"uid": "description",
						"data_type": "text",
						"display_name": "description",
						"mandatory": false,
						"max": null,
						"min": null,
						"multiple": false,
						"format": "",
						"unique": null,
						"field_metadata": {
							"allow_rich_text": false,
							"multiline": false
						}
					}]
				}
			}))
			.then(function(res) {
				myclass1 = res.body.class
			})
			.then(function(res) {
				return R.Promisify(factories.create('Create_class', sys_user1.authtoken, app.api_key, {
					"class": {
						"title": "Bugs",
						"uid": "bugs",
						"inbuilt_class": false,
						"schema": [{
							"data_type": "text",
							"display_name": "Name",
							"field_metadata": null,
							"format": "",
							"mandatory": true,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "name"
						}, {
							"data_type": "text",
							"display_name": "Description",
							"field_metadata": null,
							"format": "",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "description"
						}, {
							"data_type": "text",
							"display_name": "Reproducible?",
							"field_metadata": null,
							"format": "^(Always|Sometimes|Rarely|Unable)$",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "reproducible"
						}, {
							"data_type": "isodate",
							"display_name": "Due Date",
							"field_metadata": null,
							"format": null,
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "due_date"
						}, {
							"data_type": "text",
							"display_name": "Severity",
							"field_metadata": null,
							"format": "^(|Show Stopper|Critical|Major|Minor)$",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "severity"
						}, {
							"data_type": "text",
							"display_name": "Status",
							"field_metadata": null,
							"format": "^(Open|In Progress|To Be Tested|Closed)$",
							"mandatory": false,
							"max": null,
							"min": null,
							"multiple": false,
							"uid": "status"
						}, {
							"data_type": "reference",
							"display_name": "Project",
							"field_metadata": null,
							"format": null,
							"mandatory": true,
							"max": null,
							"min": null,
							"multiple": false,
							"reference_to": "project",
							"uid": "project"
						}],
						"options": {
							"inbuiltFields": {
								"location": true
							}
						}
					}
				}))
			})
			.then(function(res) {
				myclass2 = res.body.class
			})
			.then(function(res) {
				return factories.create('create_objects', 2, appUser1.authtoken, app.api_key, myclass1.uid, [{
					"name": "backend",
					"description": "This is a backend project"
				},
				{
					"name": "flow",
					"description": "This is a flow project"
				}])
			})
			.then(function(res) {
				return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app.api_key, myclass1.uid))
			})
			.then(function(res) {
				object1 = res.body.objects[0]
				object2 = res.body.objects[1]
			})
			.then(function(res) {
				return factories.create('create_objects', 6, appUser2.authtoken, app.api_key, myclass2.uid, [{
					"name": "one",
					"project": [object1.uid]
				},{
					"name": "two",
					"project": [object1.uid]
				},{
					"name": "three",
					"project": [object1.uid]
				},{
					"name": "four",
					"project": [object2.uid]
				},{
					"name": "five",
					"project": [object2.uid]
				},{
					"name": "six",
					"project": [object2.uid]
				}])
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })

		})




		it('should get reference objects using $in_query query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, {
			  "query": {
			    "project": {
			      "$in_query": {
			        "name": "backend"
			      }
			    }
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.name.should.be.equal('four')
				object.project[0].should.be.equal(object2.uid)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});



		it('should get reference objects using $nin_query query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, {
			  "query": {
			    "project": {
			      "$nin_query": {
			        "name": "flow"
			      }
			    }
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.name.should.be.equal('four')
				object.project[0].should.be.equal(object2.uid)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


		it('should get reference objects using include[]', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', {
			  "method": "get",
			  "include": [
			    "project"
			  ]
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				object.name.should.be.equal('one')
				object.project[0].name.should.be.equal('flow')
				object.project[0].app_user_object_uid.should.be.equal(appUser1.uid)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


		it('should get objects using ONLY BASE query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', {
			  "_method": "get",
			  "only": {
			    "BASE": [
			      "uid"
			    ]
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				Object.keys(object).should.to.be.deep.equal(['uid'])
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


		it('should get reference objects using include[] and Only BASE query', function(done) {
  		R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', {
			  "_method": "get",
			  "include": [
			    "project"
			  ],
			  "only": {
			    "BASE": [
			      "project"
			    ],
			    "project": [
			      "description"
			    ]
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				Object.keys(object).should.to.be.deep.equal(['project','uid'])
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


		it('should get objects using except BASE query', function(done) {  		
			R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', {
			  "_method": "get",
			  "except": {
			    "BASE": ["project"]
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				object.name.should.be.equal('one')
				should.not.exist(object.project)
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


  	it('should get reference objects using include[] and except BASE query', function(done) {  		
			R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', { 
				"include": ["project"],
			  "_method": "get",
			  "except": {
			    "project": ["name", "tags", "_version", "created_by", "updated_by", "__loc", "app_user_object_uid", "uid", "published", "created_at","updated_at", "description","ACL"]
			  }
			}))
			.then(function(res) {
				// R.pretty(res.body)
				object = R.last(res.body.objects)
				Object.keys(object.project[0]).should.to.be.deep.equal(['uid'])
				object.name.should.be.equal('one')
				
				// object.name.should.be.equal('one')
				// object.project.should.be.deep.equal({'uid'})
				
			})
			.then(function(res) {
				done()
			})
			.catch(function(err) {
        console.log(err)
      })
  	

  	});


  	it('should get objects using exists[field_uid] query', function(done) {  		
			R.Promisify(factories.create('get_all_objects', appUser1.authtoken, app.api_key, myclass2.uid, '', {
			  "_method": "get",
			  "exists": {
			    "ACL": true,
			    "name": true
			  }
			}))
			.then(function(res) {
				object = R.last(res.body.objects)
				object.name.should.be.equal('one')
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