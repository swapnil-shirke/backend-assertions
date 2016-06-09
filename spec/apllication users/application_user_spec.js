describe('App users ---', function() {

  var authtoken, userUID, username, email
  var api_key, appname, master_key
  var appUser

  var roleId

  var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
  var appUserName  = R.bltRandom(8);




  before(function(done) {
    
    this.timeout(25000)
    
    R.Promisify(factories.create('login_system_user'))
	  .then(function(res) {
	    authtoken = res.body.user.authtoken;
	    userUID   = res.body.user.uid;
	    username  = res.body.user.username;
	    email     = res.body.user.email;
	  })
	  .then(function(res) {
	    return R.Promisify(factories.create('Create_application', authtoken))
	  })
	  .then(function(res) {
	    api_key    = res.body.application.api_key;
	    master_key = res.body.application.master_key;
	    appname    = res.body.application.name;
	    appUid     = res.body.application.uid
	  })
	  .then(function(res) {
	    var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
	    var appUserName = R.bltRandom(8);
	    return R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
	      "object": {
	        "published": true,
	        "__loc": [72.79246119999993, 19.4563596],
	        "active": true,
	        "username": appUserName,
	        "email": appUseremail,
	        "first_name": "ironman",
	        "last_name": "avangers",
	        "password": "raw123",
	        "password_confirmation": "raw123",
	        "device_type": "ios",
	        "tags": ["testuser", "backend"]
	      }
	    }))
	  })
	  .then(function(res) {
	    appUser = res.body.object
	  })
	  .then(function(res) {
	    return R.Promisify(factories.create('Create_app_user_role', authtoken, api_key))
	  })
	  .then(function(res) {
	    roleId = res.body.object.uid
	  })
	  .then(function(res) {
	    done()
	  })
	  .catch(function(err) {
	    console.log(err)
	  })

  })


  after(function(done) {
    factories.create('Delete_application', authtoken, api_key)
    .end(function(err, res1) {
      // console.log("application delete")
      done(err)
    })

  })





  describe('App user Object', function() {

    var appUser1, object

    before(function(done) {
      // this.timeout(10000)
			var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
			var appUserName  = R.bltRandom(8);

      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "hulk",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser1 = res.body.object
      })
      .then(function(res) {
      	
      	var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
				var appUserName  = R.bltRandom(8);

      	return R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
	        "object": {
	          "published": true,
	          "__loc": [72.79246119999993, 19.4563596],
	          "active": true,
	          "username": appUserName,
	          "email": appUseremail,
	          "first_name": "catwoman",
	          "last_name": "smith",
	          "password": "raw123",
	          "password_confirmation": "raw123",
	          "device_type": "android",
	          "tags": ["catwoman", "backend"],
	          "ACL": {
	          	"others": {
						    "read": true
						  }
	          }
	        }
	      }))
      })
      .then(function(res) {
        appUser6 = res.body.object
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should be able to create application user as an object', function(done) {
      // var roleId
      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [-122.4431164995849, 37.74045209829323],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "james",
          "last_name": "bond",
          "password": "password",
          "password_confirmation": "password",
          "device_type": "ios",
          "ACL": {
            "disable": false,
            "roles": [{
              "uid": roleId,
              "read": true,
              "update": false,
              "delete": false,
            }],
            "others": {
              "read": false,
              "update": false,
              "delete": false
            }
          },
          "tags": ["supertest", "backend"]
        }

      })
      .end(function(err, res) {

        var object = res.body.object

        res.body.notice.should.be.equal('Woot! Object created successfully.')

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'ACL', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', '_version'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.username.should.be.a('string')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.device_type.should.be.a('string')
        object.ACL.should.be.a('object')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object._version.should.be.a('number')
        object.tags.should.be.a('array')
        object.ACL.disable.should.be.a('boolean')
        object.ACL.others.should.be.a('object')
        object.ACL.others.read.should.be.a('boolean')
        object.ACL.others.update.should.be.a('boolean')
        object.ACL.others.delete.should.be.a('boolean')
        object.ACL.roles.should.be.a('array')
        object.ACL.roles[0].uid.should.be.a('string')
        object.ACL.roles[0].read.should.be.a('boolean')
        object.ACL.roles[0].update.should.be.a('boolean')
        object.ACL.roles[0].delete.should.be.a('boolean')


        // Value assertion
        object.published.should.be.equal(true)
        object.__loc[0].should.be.equal(-122.4431164995849)
        object.__loc[1].should.be.equal(37.74045209829323)
        object.username.should.be.equal(appUserName)
        object.email.should.be.equal(appUseremail)
        object.first_name.should.be.equal('james')
        object.last_name.should.be.equal('bond')
        object.device_type.should.be.equal('ios')

        object.ACL.others.read.should.be.equal(false)
        object.ACL.others.update.should.be.equal(false)
        object.ACL.others.delete.should.be.equal(false)

        object.ACL.roles[0].uid.should.be.equal(roleId)
        object.ACL.roles[0].read.should.be.equal(true)
        object.ACL.roles[0].update.should.be.equal(false)
        object.ACL.roles[0].delete.should.be.equal(false)

        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(object.created_by)
        object.created_at.should.be.equal(object.updated_at)


        object._version.should.be.equal(1)
        object.tags[0].should.be.equal('supertest')

        done(err)

      })

    });


		it('should provide an error message for mandetory fields(email)', function(done) {
      // var roleId
      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [-122.4431164995849, 37.74045209829323],
          "active": true,
          // "email": appUseremail,
          "first_name": "james",
          "last_name": "bond",
          "password": "password",
          "password_confirmation": "password",
          "device_type": "ios",
          "ACL": {
            "disable": false,
            "roles": [{
              "uid": roleId,
              "read": true,
              "update": false,
              "delete": false,
            }],
            "others": {
              "read": false,
              "update": false,
              "delete": false
            }
          },
          "tags": ["supertest", "backend"]
        }

      })
      .end(function(err, res) {
      	// R.pretty(res.body)
        res.body.should.be.deep.equal({
          "error_message": "Bummer. Object creation failed. Please enter valid data.",
          "error_code": 119,
          "errors": {
            "email": [
              "is a required field"
            ]
          }
        })

        done(err)

      })

    });

    
    it('should provide an error message for unique email', function(done) {
      // var roleId
      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [-122.4431164995849, 37.74045209829323],
          "active": true,
          "username": appUserName,
          "email": appUser1.email,
          "first_name": "james",
          "last_name": "bond",
          "password": "password",
          "password_confirmation": "password",
          "device_type": "ios",
          "ACL": {
            "disable": false,
            "roles": [{
              "uid": roleId,
              "read": true,
              "update": false,
              "delete": false,
            }],
            "others": {
              "read": false,
              "update": false,
              "delete": false
            }
          },
          "tags": ["supertest", "backend"]
        }

      })
      .end(function(err, res) {
      	res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "email": [
				      "is not unique"
				    ]
				  }
				})

        done(err)

      })

    });


    it('should provide an error message for unique username', function(done) {
      // var roleId
      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [-122.4431164995849, 37.74045209829323],
          "active": true,
          "username": appUser1.username,
          "email": appUseremail,
          "first_name": "james",
          "last_name": "bond",
          "password": "password",
          "password_confirmation": "password",
          "device_type": "ios",
          "ACL": {
            "disable": false,
            "roles": [{
              "uid": roleId,
              "read": true,
              "update": false,
              "delete": false,
            }],
            "others": {
              "read": false,
              "update": false,
              "delete": false
            }
          },
          "tags": ["supertest", "backend"]
        }

      })
      .end(function(err, res) {
      	res.body.should.be.deep.equal({
				  "error_message": "Bummer. Object creation failed. Please enter valid data.",
				  "error_code": 119,
				  "errors": {
				    "username": [
				      "is not unique"
				    ]
				  }
				})

        done(err)

      })

    });


    it('should provide an error message for invalid authtoken(app user)', function(done) {
      // var roleId
      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('create_app_user_object', 'fhts2323432', api_key, {
        "object": {
          "published": true,
          "__loc": [-122.4431164995849, 37.74045209829323],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "james",
          "last_name": "bond",
          "password": "password",
          "password_confirmation": "password",
          "device_type": "ios",
          "ACL": {
            "disable": false,
            "roles": [{
              "uid": roleId,
              "read": true,
              "update": false,
              "delete": false,
            }],
            "others": {
              "read": false,
              "update": false,
              "delete": false
            }
          },
          "tags": ["supertest", "backend"]
        }

      })
      .expect(401)
      .end(function(err, res) {
      	// R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Access denied. You have insufficient permissions to perform this operation.",
				  "error_code": 162,
				  "errors": {}
				})

        done(err)

      })

    });


    it('should be able to get all application user objects present', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key)
        .expect(200)
        .end(function(err, res) {
        	// R.pretty(res.body)
          var object = R.last(res.body.objects)

          // Keys assertion
          Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version'])

          // Data type assertion
          object.published.should.be.a('boolean')
          object.__loc.should.be.a('array')
          object.username.should.be.a('string')
          object.email.should.be.a('string')
          object.first_name.should.be.a('string')
          object.last_name.should.be.a('string')
          object.device_type.should.be.a('string')
          object.ACL.should.be.a('object')
          object.app_user_object_uid.should.be.a('string')
          object.created_by.should.be.a('string')
          object.updated_by.should.be.a('string')
          object.created_at.should.be.a('string')
          object.updated_at.should.be.a('string')
          object.uid.should.be.a('string')
          object._version.should.be.a('number')
          object.tags.should.be.a('array')

          // Value assertion
          object.published.should.be.equal(true)
          object.__loc.should.be.deep.equal(appUser.__loc)
          // object.__loc[0].should.be.equal(appUser.__loc[0])
          // object.__loc[1].should.be.equal(appUser.__loc[1])
          object.username.should.be.equal(appUser.username)
          object.email.should.be.equal(appUser.email)
          object.first_name.should.be.equal(appUser.first_name)
          object.last_name.should.be.equal(appUser.last_name)
          object.device_type.should.be.equal('ios')

          object.app_user_object_uid.should.be.equal('system')
          object.created_by.should.be.equal(userUID)
          object.updated_by.should.be.equal(object.created_by)
          object.created_at.should.be.equal(object.updated_at)

          object._version.should.be.equal(1)
          object.tags.should.be.deep.equal(['testuser', 'backend'])

          done(err)

        })

    });

    
    it('should be able to get single application user object', function(done) {

      factories.create('get_object_app_user', authtoken, api_key, appUser1.uid)
        .end(function(err, res) {

          var object = res.body.object

          // Keys assertion
          Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version'])

          // Data type assertion
          object.published.should.be.a('boolean')
          object.__loc.should.be.a('array')
          object.username.should.be.a('string')
          object.email.should.be.a('string')
          object.first_name.should.be.a('string')
          object.last_name.should.be.a('string')
          object.device_type.should.be.a('string')
          object.ACL.should.be.a('object')
          object.app_user_object_uid.should.be.a('string')
          object.created_by.should.be.a('string')
          object.updated_by.should.be.a('string')
          object.created_at.should.be.a('string')
          object.updated_at.should.be.a('string')
          object.uid.should.be.a('string')
          object._version.should.be.a('number')
          object.tags.should.be.a('array')

          // Value assertion
          object.published.should.be.equal(true)
          object.__loc.should.be.deep.equal(appUser1.__loc)
          // object.__loc[0].should.be.equal(appUser.__loc[0])
          // object.__loc[1].should.be.equal(appUser.__loc[1])
          object.username.should.be.equal(appUser1.username)
          object.email.should.be.equal(appUser1.email)
          object.first_name.should.be.equal(appUser1.first_name)
          object.last_name.should.be.equal(appUser1.last_name)
          object.device_type.should.be.equal('ios')

          object.app_user_object_uid.should.be.equal('system')
          object.created_by.should.be.equal(userUID)
          object.updated_by.should.be.equal(object.created_by)
          object.created_at.should.be.equal(object.updated_at)

          object._version.should.be.equal(1)
          object.tags.should.be.deep.equal(['testuser', 'backend'])

          done(err)

        })

    });


    it('should provide an error message for invalid uid', function(done) {

      factories.create('get_object_app_user', authtoken, api_key, 'adafewt34vf')
        .end(function(err, res) {
        	// R.pretty(res.body)
          res.body.should.be.deep.equal({
					  "error_message": "Bummer. The requested object doesn't exist.",
					  "error_code": 141,
					  "errors": {
					    "uid": [
					      "is invalid"
					    ]
					  }
					})

          done(err)

        })

    });

    
    it('should be able to update application user object', function(done) {

      factories.create('update_object_app_user', authtoken, api_key, appUser1.uid, {
        "object": {
          "first_name": "objectUpdate",
          "last_name": "objectUpdate"
        }
      })
      .expect(200)
      .end(function(err, res) {

        var object = res.body.object

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.username.should.be.a('string')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.device_type.should.be.a('string')
        object.ACL.should.be.a('object')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object._version.should.be.a('number')
        object.tags.should.be.a('array')

        // Value assertion
        object.published.should.be.equal(true)
        object.__loc.should.be.deep.equal(appUser1.__loc)
        // object.__loc[0].should.be.equal(appUser.__loc[0])
        // object.__loc[1].should.be.equal(appUser.__loc[1])
        object.username.should.be.equal(appUser1.username)
        object.email.should.be.equal(appUser1.email)
        object.first_name.should.be.equal('objectUpdate')
        object.last_name.should.be.equal('objectUpdate')
        object.device_type.should.be.equal('ios')

        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(object.created_by)
        object.created_at.should.be.not.equal(object.updated_at)

        object._version.should.be.equal(2)
        object.tags.should.be.deep.equal(['testuser', 'backend'])

        done(err)

      })

    });


    it('should provide an error message for invalid authtoken(app user) for update', function(done) {

      factories.create('update_object_app_user', 'asdafe2323dfr445', api_key, appUser1.uid, {
        "object": {
          "first_name": "objectUpdate",
          "last_name": "objectUpdate"
        }
      })
      .expect(401)
      .end(function(err, res) {
      	// R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Access denied. You have insufficient permissions to perform this operation.",
				  "error_code": 162,
				  "errors": {}
				})

        done(err)

      })

    });

    
    it('should provide an error message for invalid uid for update', function(done) {

      factories.create('update_object_app_user', authtoken, api_key, 'asfa323dfgs', {
        "object": {
          "first_name": "objectUpdate",
          "last_name": "objectUpdate"
        }
      })
      .expect(422)
      .end(function(err, res) {
      	// R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. The requested object doesn't exist.",
				  "error_code": 141,
				  "errors": {
				    "uid": [
				      "is invalid"
				    ]
				  }
				})

        done(err)

      })

    });

    
    it('should be able to search application users using query', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', { query: {"email": appUser.email } })
        .expect(200)
        .end(function(err, res) {
          
          var object = R.last(res.body.objects)
          
          // Keys assertion
          Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version'])

          // Data type assertion
          object.published.should.be.a('boolean')
          object.__loc.should.be.a('array')
          object.username.should.be.a('string')
          object.email.should.be.a('string')
          object.first_name.should.be.a('string')
          object.last_name.should.be.a('string')
          object.device_type.should.be.a('string')
          object.ACL.should.be.a('object')
          object.app_user_object_uid.should.be.a('string')
          object.created_by.should.be.a('string')
          object.updated_by.should.be.a('string')
          object.created_at.should.be.a('string')
          object.updated_at.should.be.a('string')
          object.uid.should.be.a('string')
          object._version.should.be.a('number')
          object.tags.should.be.a('array')

          // Value assertion
          object.published.should.be.equal(true)
          object.__loc.should.be.deep.equal(appUser.__loc)
          
          object.username.should.be.equal(appUser.username)
          object.email.should.be.equal(appUser.email)
          object.first_name.should.be.equal(appUser.first_name)
          object.last_name.should.be.equal(appUser.last_name)
          object.device_type.should.be.equal('ios')

          object.app_user_object_uid.should.be.equal('system')
          object.created_by.should.be.equal(userUID)
          object.updated_by.should.be.equal(object.created_by)
          object.created_at.should.be.equal(object.updated_at)

          object._version.should.be.equal(1)
          object.tags.should.be.deep.equal(['testuser', 'backend'])

          done(err)

        })

    });



    it('should provide an error message for invalid authtoken for delete', function(done) {

      factories.create('delete_object_app_user', 'asdwvf434vdfv', api_key, appUser1.uid)
        .expect(401)
        .end(function(err, res) {
        	// R.pretty(res.body)
          res.body.should.be.deep.equal({
					  "error_message": "Access denied. You have insufficient permissions to perform this operation.",
					  "error_code": 162,
					  "errors": {}
					})

          done(err)

        })

    });


    it('should be able to delete application user object', function(done) {

      factories.create('delete_object_app_user', authtoken, api_key, appUser1.uid)
      .expect(200)  
      .end(function(err, res) {

        res.body.notice.should.be.equal('Woot! Object deleted successfully.')

        done(err)

      })

    });



    it('should provide an error message for invalid uid for delete', function(done) {

      factories.create('delete_object_app_user', authtoken, api_key, 'adf34d34d')
        .expect(422)
        .end(function(err, res) {
        	// R.pretty(res.body)
          res.body.should.be.deep.equal({
					  "error_message": "Bummer. The requested object doesn't exist.",
					  "error_code": 141,
					  "errors": {
					    "uid": [
					      "is invalid"
					    ]
					  }
					})

          done(err)

        })

    });


    it('should be able to get application user objects count', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "count": "true"
      })
      .expect(200)
      .end(function(err, res) {
        
        res.body.objects.should.be.equal(3)  


        done(err)

      })

    });

    
    it('should be able to get application user objects includeing count', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "include_count": "true"
      })
      .expect(200)
      .end(function(err, res) {
        // R.pretty(res.body)
        res.body.count.should.be.equal(3)  

        var object = R.last(res.body.objects)

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.username.should.be.a('string')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.device_type.should.be.a('string')
        object.ACL.should.be.a('object')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object._version.should.be.a('number')
        object.tags.should.be.a('array')

        // Value assertion
        object.published.should.be.equal(true)
        object.__loc.should.be.deep.equal(appUser.__loc)
        // object.__loc[0].should.be.equal(appUser.__loc[0])
        // object.__loc[1].should.be.equal(appUser.__loc[1])
        object.username.should.be.equal(appUser.username)
        object.email.should.be.equal(appUser.email)
        object.first_name.should.be.equal(appUser.first_name)
        object.last_name.should.be.equal(appUser.last_name)
        object.device_type.should.be.equal('ios')

        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(object.created_by)
        object.created_at.should.be.equal(object.updated_at)

        object._version.should.be.equal(1)
        object.tags.should.be.deep.equal(['testuser', 'backend'])

        done(err)

      })

    });


    it('should be able to get application user objects using skip and count', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "skip": 1,
        "include_count": true
      })
      .expect(200)
      .end(function(err, res) {
        // R.pretty(res.body)
        res.body.objects.length.should.be.equal(2)
        res.body.count.should.be.equal(3)  


        done(err)

      })

    });


    it('should be able to get application user objects using limit and count', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "limit": 1,
        "include_count": true
      })
      .expect(200)
      .end(function(err, res) {
        // R.pretty(res.body)
        res.body.objects.length.should.be.equal(1)
        res.body.count.should.be.equal(3)  


        done(err)

      })

    });


    it('should be able to get application user objects using skip', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "skip": 2,
        "include_count": true
      })
      .expect(200)
      .end(function(err, res) {
        // R.pretty(res.body)
        res.body.objects.length.should.be.equal(1)
        res.body.count.should.be.equal(3)


        done(err)

      })

    });
    

    it('should be able to get application user objects using -ve skip value', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "skip": -2
      })
      .expect(422)
      .end(function(err, res) {
        // R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. Failed to fetch objects. Please try again with valid parameters.",
				  "error_code": 141,
				  "errors": {
				    "params": [
				      "has an invalid operation."
				    ]
				  }
				})

        done(err)

      })

    });


    it('should be able to get application user objects using -ve limit value', function(done) {

      factories.create('get_app_user_objects', authtoken, api_key, '', {
        "limit": -1,
        "skip": 1

      })
      .expect(200)
      .end(function(err, res) {
        // R.pretty(res.body)
        var object = res.body.objects[0]

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'ACL', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', '_version'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.username.should.be.a('string')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.device_type.should.be.a('string')
        object.ACL.should.be.a('object')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object._version.should.be.a('number')
        object.tags.should.be.a('array')

        // Value assertion
        object.published.should.be.equal(true)
        object.__loc.should.be.deep.equal(object.__loc)
        // object.__loc[0].should.be.equal(appUser.__loc[0])
        // object.__loc[1].should.be.equal(appUser.__loc[1])
        object.username.should.be.equal(object.username)
        object.email.should.be.equal(object.email)
        object.first_name.should.be.equal(object.first_name)
        object.last_name.should.be.equal(object.last_name)
        object.device_type.should.be.equal('android')

        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(object.created_by)
        object.created_at.should.be.equal(object.updated_at)

        object._version.should.be.equal(1)
        object.tags.should.be.deep.equal(['catwoman', 'backend'])

        done(err)

      })

    });

 
  });


  describe('App users registration', function() {

    var appUser2, appUser_authtoken

    before(function(done) {
      // this.timeout(10000)
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName = R.bltRandom(8);

      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "hulk",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
        .then(function(res) {
          appUser2 = res.body.object
        })
        .then(function(res) {
          return R.Promisify(factories.create('login_app_user', api_key, {
            "application_user": {
              "username": appUserName,
              "password": "raw123"
            }
          }))
        })
        .then(function(res) {
          appUser_authtoken = res.body.application_user.authtoken
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })

    })

    it('should be able to register application users', function(done) {

      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('register_app_user', api_key, {
        "application_user": {
          "email": appUseremail,
          "first_name": "john",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "username": appUserName
        }
      })
      .end(function(err, res) {

        var object = res.body.application_user

        res.body.notice.should.be.equal('Woot! You have successfully registered!')

        // // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['email', 'first_name', 'last_name', 'username', 'app_user_object_uid', 'created_at', 'updated_at', 'uid', 'published', 'ACL', '__loc', '_version', 'active', 'created_by', 'updated_by', 'tags'])

        // // Data type assertion
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.username.should.be.a('string')
        object.app_user_object_uid.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object.published.should.be.a('boolean')
        object.ACL.should.be.a('object')
        object._version.should.be.a('number')
        object.active.should.be.a('boolean')
        object.tags.should.be.a('array')

        // Value assertion
        should.not.exist(object.updated_by)
        should.not.exist(object.created_by)
        should.not.exist(object.__loc)

        object.published.should.be.equal(true)

        object.email.should.be.equal(appUseremail)
        object.first_name.should.be.equal('john')
        object.last_name.should.be.equal('smith')
        object.username.should.be.equal(appUserName)
        object.active.should.be.equal(false)
        object.app_user_object_uid.should.be.equal('system')
        object.created_at.should.be.equal(object.updated_at)


        object._version.should.be.equal(1)
        object.tags.should.be.deep.equal([])

        done(err)

      })

    });


    it('should provide error message for password confirmation', function(done) {

      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('register_app_user', api_key, {
        "application_user": {
          "email": appUseremail,
          "first_name": "john",
          "last_name": "smith",
          "password": "raw1234",
          "password_confirmation": "raw123",
          "username": appUserName
        }
      })
      .end(function(err, res) {
      	res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't sign you up. Please try again.",
				  "error_code": 192,
				  "errors": {
				    "password_confirmation": [
				      "password and password_confirmation must match"
				    ]
				  }
				})

        done(err)

      })

    });


    it('should provide error message for register unique username', function(done) {

      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('register_app_user', api_key, {
        "application_user": {
          "email": appUseremail,
          "first_name": "john",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "username": appUser2.username
        }
      })
      .end(function(err, res) {
    		// R.pretty(res.body)
      	res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't sign you up. Please try again.",
				  "error_code": 127,
				  "errors": {
				    "username": [
				      "is not unique"
				    ]
				  }
				})

        done(err)

      })

    });


    it('should provide error message for register unique email', function(done) {

      var appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      var appUserName = R.bltRandom(8);

      factories.create('register_app_user', api_key, {
        "application_user": {
          "email": appUser2.email,
          "first_name": "john",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "username": appUserName
        }
      })
      .end(function(err, res) {
    		// R.pretty(res.body)
      	res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't sign you up. Please try again.",
				  "error_code": 127,
				  "errors": {
				    "email": [
				      "is not unique"
				    ]
				  }
				})

        done(err)

      })

    });

    
    it('should be able to update registered application user', function(done) {

      factories.create('update_register_app_user', appUser_authtoken, api_key, appUser2.uid, {
        "application_user": {
          "first_name": "objectUpdate",
          "last_name": "objectUpdate",
        }
      })
      .expect(200)
      .end(function(err, res) {

        var object = res.body.application_user

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version', 'last_login_at'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.username.should.be.a('string')
        object.device_type.should.be.a('string')
        object.tags.should.be.a('array')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object.ACL.should.be.a('object')
        object._version.should.be.a('number')
        object.last_login_at.should.be.a('string')

        // value assertion
        object.published.should.be.equal(true)
        object.__loc.should.be.deep.equal([72.79246119999993, 19.4563596])
        object.email.should.be.equal(appUser2.email)
        object.first_name.should.be.equal('objectUpdate')
        object.last_name.should.be.equal('objectUpdate')
        object.username.should.be.equal(appUser2.username)
        object.device_type.should.be.equal('ios')
        object.tags.should.be.deep.equal(["testuser", "backend"])
        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(userUID)
        object.created_at.should.be.not.equal(object.updated_at)
        object.uid.should.be.equal(appUser2.uid)
        object.ACL.can[0].should.be.equal('update')
        object.ACL.can[1].should.be.equal('delete')

        object._version.should.be.equal(3)
        // object.last_login_at.should.be.equal('string')

        done(err)

      })

    });

    
    it('should provide an error message for invalid app user authtoken ', function(done) {

      factories.create('update_register_app_user', '', api_key, appUser2.uid, {
        "application_user": {
          "first_name": "objectUpdate",
          "last_name": "objectUpdate",
        }
      })
      .expect(422)
      .end(function(err, res) {
      	// R.pretty(res.body)
      	res.body.should.be.deep.equal({
				  "error_message": "Access denied. You have insufficient permissions to perform this operation.",
				  "error_code": 162,
				  "errors": {}
				})

        done(err)

      })

    });

   
    it('should be able to get registered application user', function(done) {

      factories.create('get_register_app_user', appUser_authtoken, api_key, appUser2.uid)
      .end(function(err, res) {

        var object = res.body.application_user

        // Keys assertion
        Object.keys(object).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version', 'last_login_at'])

        // Data type assertion
        object.published.should.be.a('boolean')
        object.__loc.should.be.a('array')
        object.email.should.be.a('string')
        object.first_name.should.be.a('string')
        object.last_name.should.be.a('string')
        object.username.should.be.a('string')
        object.device_type.should.be.a('string')
        object.tags.should.be.a('array')
        object.app_user_object_uid.should.be.a('string')
        object.created_by.should.be.a('string')
        object.updated_by.should.be.a('string')
        object.created_at.should.be.a('string')
        object.updated_at.should.be.a('string')
        object.uid.should.be.a('string')
        object.ACL.should.be.a('object')
        object._version.should.be.a('number')
        object.last_login_at.should.be.a('string')

        // value assertion
        object.published.should.be.equal(true)
        object.__loc.should.be.deep.equal([72.79246119999993, 19.4563596])
        object.email.should.be.equal(appUser2.email)
        object.first_name.should.be.equal('objectUpdate')
        object.last_name.should.be.equal('objectUpdate')
        object.username.should.be.equal(appUser2.username)
        object.device_type.should.be.equal('ios')
        object.tags.should.be.deep.equal(["testuser", "backend"])
        object.app_user_object_uid.should.be.equal('system')
        object.created_by.should.be.equal(userUID)
        object.updated_by.should.be.equal(userUID)
        object.created_at.should.be.not.equal(object.updated_at)
        object.uid.should.be.equal(appUser2.uid)
        object.ACL.can[0].should.be.equal('update')
        object.ACL.can[1].should.be.equal('delete')

        object._version.should.be.equal(3)
        // object.last_login_at.should.be.equal('string')

        done(err)

      })

    });

    
    it('should be able to deactivate an existing application user', function(done) {

      factories.create('delete_register_app_user', appUser_authtoken, api_key, appUser2.uid)
      .end(function(err, res) {
        res.body.notice.should.be.equal('Woot! Object deleted successfully.')

        done(err)

      })

    });


  });


  describe('App user login/logout', function() {

    appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
    appUserName = R.bltRandom(8);

    var appUser3, userAuthtoken, user

    before(function(done) {
      // this.timeout(10000)


      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "kurt",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser3 = res.body.object
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })

    })

    it('should provide error message for invalid application user login operation', function(done) {

      factories.create('login_app_user', api_key, {
        "application_user": {
          "email": "asd",
          "password": "raw123"
        }
      })
      .end(function(err, res) {
        res.body.should.be.deep.equal({
          "error_message": "Bummer. Login failed. Please try again.",
          "error_code": 131,
          "errors": {
            "auth": [
              "Looks like your email or password is invalid"
            ]
          }
        })

        done(err)
      })

    });

    it('should be able to login users registered for an application', function(done) {

      factories.create('login_app_user', api_key, {
        "application_user": {
          "email": appUser3.email,
          "password": "raw123"
        }
      })
        .end(function(err, res) {

          res.body.notice.should.be.equal('Woot! Logged in successfully!')

          user = res.body.application_user
          userAuthtoken = res.body.application_user.authtoken

          // key assertion
          Object.keys(user).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version', 'last_login_at', 'authtoken'])

          // data assertion
          user.published.should.be.a('boolean')
          user.__loc.should.be.a('array')
          user.email.should.be.a('string')
          user.first_name.should.be.a('string')
          user.last_name.should.be.a('string')
          user.device_type.should.be.a('string')
          user.tags.should.be.a('array')
          user.app_user_object_uid.should.be.a('string')
          user.created_by.should.be.a('string')
          user.updated_by.should.be.a('string')
          user.created_at.should.be.a('string')
          user.updated_at.should.be.a('string')
          user.uid.should.be.a('string')
          user.active.should.be.a('boolean')
          user.ACL.should.be.a('object')
          user._version.should.be.a('number')
          user.last_login_at.should.be.a('string')
          user.authtoken.should.be.a('string')

          // value assertion
          user.published.should.be.equal(true)
          user.__loc.should.be.deep.equal([72.79246119999993, 19.4563596])
          user.email.should.be.equal(appUser3.email)
          user.first_name.should.be.equal(appUser3.first_name)
          user.last_name.should.be.equal(appUser3.last_name)
          user.device_type.should.be.equal('ios')
          user.tags.should.be.deep.equal(['testuser', 'backend'])
          user.app_user_object_uid.should.be.equal('system')
          user.created_by.should.be.equal(userUID)
          user.updated_by.should.be.equal(userUID)
          user.created_at.should.be.not.equal(user.updated_at)

          user.uid.should.be.equal(appUser3.uid)
          user.active.should.be.equal(true)
          user.ACL.should.be.deep.equal({})
          user._version.should.be.equal(2)

          done(err)
        })

    });

    it('should provide error message for invalid application user logout operation', function(done) {

      factories.create('logout_app_user', "userAuthtoken", api_key)
        .end(function(err, res) {
          res.body.error_message.should.be.equal('Access denied. You have insufficient permissions to perform this operation.')
          res.body.error_code.should.be.equal(162)
          done(err)
        })

    });

    it('should be able to logout application user from an apllication', function(done) {

      R.Promisify(factories.create('login_app_user', api_key, {
        "application_user": {
          "email": appUser3.email,
          "password": "raw123"
        }
      }))
        .then(function(res) {

          return R.Promisify(factories.create('logout_app_user', res.body.application_user.authtoken, api_key))

        })
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! Logged out successfully.')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })

    });


  });


  describe('App user token/uid', function() {

    var appUser4, userAuthtoken1
    this.timeout(25000)
    
    before(function(done) {
      
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName  = R.bltRandom(8);
      
      this.timeout(35000)
      
      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "patrick",
          "last_name": "smith",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser4 = res.body.object
      })
      .then(function(res) {
        return R.Promisify(factories.create('login_app_user', api_key, {
          "application_user": {
            "username": appUserName,
            "password": "raw123"
          }
        }))
      })
      .then(function(res) {
        userAuthtoken1 = res.body.application_user.authtoken
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })

    
    it('should be able to get current logged in application user', function(done) {
      this.timeout(30000)
      
      R.Promisify(factories.create('get_current_app_user', userAuthtoken1, api_key))
        .then(function(res) {
          user = res.body.application_user
          userAuthtoken = res.body.application_user.authtoken

          // key assertion
          Object.keys(user).should.to.be.deep.equal(['published', '__loc', 'username', 'email', 'first_name', 'last_name', 'device_type', 'tags', 'app_user_object_uid', 'created_by', 'updated_by', 'created_at', 'updated_at', 'uid', 'active', 'ACL', '_version', 'last_login_at', 'isApplicationUser', 'authtoken'])

          // data assertion
          user.published.should.be.a('boolean')
          user.__loc.should.be.a('array')
          user.email.should.be.a('string')
          user.first_name.should.be.a('string')
          user.last_name.should.be.a('string')
          user.device_type.should.be.a('string')
          user.tags.should.be.a('array')
          user.app_user_object_uid.should.be.a('string')
          user.created_by.should.be.a('string')
          user.updated_by.should.be.a('string')
          user.created_at.should.be.a('string')
          user.updated_at.should.be.a('string')
          user.uid.should.be.a('string')
          user.active.should.be.a('boolean')
          user.ACL.should.be.a('object')
          user._version.should.be.a('number')
          user.last_login_at.should.be.a('string')
          user.isApplicationUser.should.be.a('boolean')
          user.authtoken.should.be.a('string')

          // value assertion
          user.published.should.be.equal(true)
          user.__loc.should.be.deep.equal([72.79246119999993, 19.4563596])
          user.email.should.be.equal(appUser4.email)
          user.first_name.should.be.equal(appUser4.first_name)
          user.last_name.should.be.equal(appUser4.last_name)
          user.device_type.should.be.equal('ios')
          user.tags.should.be.deep.equal(['testuser', 'backend'])
          user.app_user_object_uid.should.be.equal('system')
          user.created_by.should.be.equal(userUID)
          user.updated_by.should.be.equal(userUID)
          user.created_at.should.be.not.equal(user.updated_at)

          user.uid.should.be.equal(appUser4.uid)
          user.active.should.be.equal(true)
          user.ACL.should.be.deep.equal({ })
          user._version.should.be.equal(2)
          user.isApplicationUser.should.be.equal(true)
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })

    });


    it('should provide an error message for invalid application user authtoken', function(done) {
      this.timeout(30000)
      
      R.Promisify(factories.create('get_current_app_user', '899769kjnkj', api_key))
        .then(function(res) {
        	// R.pretty(res.body)
          res.status.should.be.equal(422)
          res.body.should.be.deep.equal({
					  "error_message": "Access denied. You have insufficient permissions to perform this operation.",
					  "error_code": 162,
					  "errors": {}
					})
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })

    });

    
    it('should be able to retrieve application user uid', function(done) {
      
      R.Promisify(factories.create('app_user_retrieve_user_uid', api_key, {
        "application_user": {
          "email": appUser4.email
        }
      }))
      .then(function(res) {
        res.body.uid.should.be.equal(appUser4.uid)
        done()

      })
      .catch(function(err) {
        console.log(err)
      })

    });


    it('should be able to an application user token by using an application`s master key', function(done) {
      
      R.Promisify(factories.create('app_user_token', master_key, api_key, appUser4.uid))
      .then(function(res) {
        
        res.body.token.should.be.a('string')
        done()
      })

    });


    it('should provide an error message for an invalid application`s master key', function(done) {
      
      R.Promisify(factories.create('app_user_token', 'kdsj43fvbgkj', api_key, appUser4.uid))
      .then(function(res) {
        // R.pretty(res.body)
        // res.body.token.should.be.a('string')
        done()
      })

    });


  });


  describe('App user activations', function() {
    

    var appUser5, userAuthtoken1, token

    before(function(done) {
      
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName  = R.bltRandom(8);
      
      this.timeout(25000)
      
      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": false,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "barak",
          "last_name": "obama",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser5 = res.body.object
      })
      .then(function(res) {
        return R.Promisify(factories.create('app_user_token', master_key, api_key, appUser5.uid))
      })
      .then(function(res) {
        token = res.body.token
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })

    })

    it('should be able to activate app user`s account', function(done) {
      R.Promisify(factories.create('activate_app_user', api_key, appUser5.uid, token))
      .then(function(res) {
        res.body.notice.should.be.equal('Woot! Account activated successfully!')
        done()
      })   
    
    });

    it('should provide an error message for invalid token', function(done) {
      R.Promisify(factories.create('activate_app_user', api_key, appUser5.uid, '4569y8zvzkdfgzdf'))
      .then(function(res) {
      	// R.pretty(res.body)
      	res.status.should.be.equal(422)
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't retreive the token for you.",
				  "error_code": 147,
				  "errors": {
				    "token": [
				      "Bummer. The token provided is invalid. Please try again."
				    ]
				  }
				})
        
      })
      .then(function(res) {
      	done()
      })   
    
    });   
  

  })  


  describe('App user requests', function() {
    

    var appUser6, userAuthtoken1, token

    before(function(done) {
      
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName  = R.bltRandom(8);
      
      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "barak",
          "last_name": "obama",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser6 = res.body.object
      })
      .then(function(res) {
        return R.Promisify(factories.create('app_user_token', master_key, api_key, appUser6.uid))
      })
      .then(function(res) {
        token = res.body.token
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })

    })
    
    
    it('should be able to request reset password, for an application', function(done) {
      R.Promisify(factories.create('req_forgot_password', api_key, {
        "application_user": {
            "email": appUser6.email
        }
      }))
      .then(function(res) {
        res.body.notice.should.be.equal('OK! We\'ve sent you an email. Please check it for further instructions.')
        
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

    
    it('should provide an error message for invalid email for forgot password', function(done) {
      R.Promisify(factories.create('req_forgot_password', api_key, {
        "application_user": {
            "email": "swapnil.shirke@raweng.com"
        }
      }))
      .then(function(res) {
      	
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't help you with your password. Please try again.",
				  "error_code": 148,
				  "errors": {
				    "email": [
				      "is invalid"
				    ]
				  }
				})
        
      })
      .then(function(res) {
      	done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

  
  })


  describe('App user forgot password', function() {
    

    var appUser7, userAuthtoken1, token

    before(function(done) {
      
      this.timeout(25000)
      
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName  = R.bltRandom(8);
      
      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "barak",
          "last_name": "obama",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser7 = res.body.object
      })
      .then(function(res) {
        return R.Promisify(factories.create('app_user_token', master_key, api_key, appUser7.uid))
      })
      .then(function(res) {
        token = res.body.token
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })

    })

    
    it('should be able to reset password using provided token', function(done) {
      
      R.Promisify(factories.create('reset_password_app_user', api_key, {
        "application_user": {
          "reset_password_token": token,
          "password": "password",
          "password_confirmation": "password"
        }
      }))
      .then(function(res) {
        res.body.notice.should.be.equal('Woot! You\'ve successfully reset your password.')
        
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

    
    it('should provide an error message for invalid reset password token', function(done) {
      
      R.Promisify(factories.create('reset_password_app_user', api_key, {
        "application_user": {
          "reset_password_token": "swapnil",
          "password": "password",
          "password_confirmation": "password"
        }
      }))
      .then(function(res) {
        // R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. Couldn't reset your password. Please try again.",
				  "error_code": 149,
				  "errors": {
				    "reset_password_token": [
				      "Bummer. The token provided is invalid. Please try again."
				    ]
				  }
				})
      })
      .then(function(res) {
      	done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

 
  });


  describe('App user validate_token', function() {
    

    var appUser8, userAuthtoken1, token

    before(function(done) {
      
      
      
      appUseremail = R.bltRandom(8) + "@" + "mailinator.com";
      appUserName  = R.bltRandom(8);
      
      R.Promisify(factories.create('create_app_user_object', authtoken, api_key, {
        "object": {
          "published": true,
          "__loc": [72.79246119999993, 19.4563596],
          "active": true,
          "username": appUserName,
          "email": appUseremail,
          "first_name": "barak",
          "last_name": "obama",
          "password": "raw123",
          "password_confirmation": "raw123",
          "device_type": "ios",
          "tags": ["testuser", "backend"]
        }
      }))
      .then(function(res) {
        appUser8 = res.body.object
      })
      .then(function(res) {
        return R.Promisify(factories.create('app_user_token', master_key, api_key, appUser8.uid))
      })
      .then(function(res) {
        token = res.body.token
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })

    })

    

    it('should be able to check whether reset password token is valid or not', function(done) {
      
      R.Promisify(factories.create('validate_token_app_user', api_key, { 'application_user[reset_password_token]': token }))
      .then(function(res) {
        res.body.notice.should.be.equal('That token works!')
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

    
    it('should provide an error message for invalid provided token', function(done) {
      
      R.Promisify(factories.create('validate_token_app_user', api_key, { 'application_user[reset_password_token]': 'swapnil' }))
      .then(function(res) {
      	// R.pretty(res.body)
        res.body.should.be.deep.equal({
				  "error_message": "Bummer. The token provided is invalid. Please try again.",
				  "error_code": 210,
				  "errors": {
				    "reset_password_token": [
				      "is not valid, or it might have expired"
				    ]
				  }
				})
        
      })
      .then(function(res) {
      	done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    });

  
  });




})