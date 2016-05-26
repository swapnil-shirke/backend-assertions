describe('Applications ---', function() {

  var authtoken, userUID
  var api_key
  var username
  var email
  var appname



  before(function(done){
    // this.timeout(25000)
    R.Promisify(factories.create('login_system_user'))
    .then(function(res) {
      authtoken = res.body.user.authtoken;
      userUID   = res.body.user.uid;
      username  = res.body.user.username;
      email     = res.body.user.email;
    })
    .then(function(res){
      return R.Promisify(factories.create('Create_application', authtoken))
    })
    .then(function(res){
        api_key    = res.body.application.api_key;
        master_key = res.body.application.master_key;
        appname    = res.body.application.name;
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
        //console.log("application delete")
        done(err)
      })
  
  })





  describe('Get restricted uids', function() {
    
    it('should be able to get list of all restricted uids for an application', function(done) {
      R.Promisify(api.get(config.endpoints.restricted_uids)
      .set('web_ui_api_key', config.web_ui_api_key)
      .expect(200))
      .then(function(res) {
        res.body.should.be.deep.equal({
          "restricted": [
            "published",
            "uid",
            "created_at",
            "deleted_at",
            "updated_at",
            "tags_array",
            "klass_id",
            "applikation_id",
            "*_ids",
            "id",
            "_id",
            "ACL",
            "SYS_ACL",
            "DEFAULT_ACL",
            "app_user_object_uid",
            "built_io_upload",
            "__loc",
            "tags",
            "_owner",
            "_version",
            "toJSON",
            "save",
            "update",
            "domain",
            "shard_account",
            "shard_app",
            "shard_random",
            "hook",
            "__indexes",
            "__meta",
            "created_by",
            "updated_by",
            "inbuilt_class",
            "tenant_id",
            "isSystemUser",
            "isApplicationUser",
            "isNew",
            "_shouldLean",
            "_shouldFilter",
            "options",
            "_version",
            "__v"
          ]
        })
        
        done()
      });
    
    });


  })


  describe('App creation', function() {

    
    it('should be able to create an application as a system user', function(done) {

      var appName = "Post App"

      factories.create('Create_application', authtoken, {
          "name": appName
      })
      .expect(201)
      .end(function(err, res) {
        var application = res.body.application

        res.body.notice.should.be.equal('Hurray! Application created successfully.')

        // Keys assertion
        Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL', 'discrete_variables'])

        // Data type assertion
        application.created_at.should.be.a('string')
        application.updated_at.should.be.a('string')
        application.uid.should.be.a('string')
        application.name.should.be.a('string')
        application.api_key.should.be.a('string')
        application.owner_uid.should.be.a('string')
        application.user_uids.should.be.a('array')
        application.SYS_ACL.should.be.a('object')

        application.uid.length.should.be.equal(19)
        application.api_key.length.should.be.equal(19)
        application.master_key.length.should.be.equal(19)
        application.owner_uid.length.should.be.equal(27)
        application.user_uids.length.should.be.equal(1)

        // Value assertion
        application.name.should.be.equal(appName)
        application.created_at.should.be.equal(application.updated_at)
        application.owner_uid.should.be.equal(userUID)
        application.owner_uid.should.be.equal(application.user_uids[0])

        factories.create('Delete_application', authtoken, application.api_key)
          .end(function(err, res) {
            
            done(err)
          })
      })
    
    });


    it('should provide error message for invalid authtoken while creating application', function(done) {

      var appName = "Post App"

      factories.create('Create_application', "asdasd", {
          "name": appName
      })
      .expect(401)
      .end(function(err, res) {
        res.body.should.be.deep.equal({
          "error_message": "Hey! You're not allowed in here unless you're logged in.",
          "error_code": 105,
          "errors": {}
        })
         done(err)
      })
    
    });

  
  });


  describe('Get applications', function() {

    
    it('should be able to get all applications', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get"
        })
        .end(function(err, res) {
          
          res.body.applications.length.should.be.equal(1)


          var application = res.body.applications[0]

          // Keys assertion
          Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL'])

          // Data type assertion
          application.created_at.should.be.a('string')
          application.updated_at.should.be.a('string')
          application.uid.should.be.a('string')
          application.name.should.be.a('string')
          application.api_key.should.be.a('string')
          application.owner_uid.should.be.a('string')
          application.user_uids.should.be.a('array')
          application.SYS_ACL.should.be.a('object')

          application.uid.length.should.be.equal(19)
          application.api_key.length.should.be.equal(19)
          application.master_key.length.should.be.equal(19)
          application.owner_uid.length.should.be.equal(27)
          application.user_uids.length.should.be.equal(1)

          // Value assertion
          application.api_key.should.be.equal(api_key)

          application.created_at.should.be.equal(application.updated_at)
          application.owner_uid.should.be.equal(userUID)
          application.owner_uid.should.be.equal(application.user_uids[0])



          done(err)
        })
    
    })


    it('should be able to get count of applications created', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "count": true
        })
        .end(function(err, res) {
          // R.pretty(res.body)
          Object.keys(res.body).should.to.be.deep.equal(['applications'])
          res.body.applications.should.be.equal(1)
          
          done(err)
        })
    
    })


    it('should be able to get an application using query', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "query": {
            "api_key": api_key
          }
        })
        .end(function(err, res) {
          res.body.applications.length.should.be.equal(1)


          var application = res.body.applications[0]

          // Keys assertion
          Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL'])

          // Data type assertion
          application.created_at.should.be.a('string')
          application.updated_at.should.be.a('string')
          application.uid.should.be.a('string')
          application.name.should.be.a('string')
          application.api_key.should.be.a('string')
          application.owner_uid.should.be.a('string')
          application.user_uids.should.be.a('array')
          application.SYS_ACL.should.be.a('object')

          application.uid.length.should.be.equal(19)
          application.api_key.length.should.be.equal(19)
          application.master_key.length.should.be.equal(19)
          application.owner_uid.length.should.be.equal(27)
          application.user_uids.length.should.be.equal(1)

          // Value assertion
          application.api_key.should.be.equal(api_key)

          application.created_at.should.be.equal(application.updated_at)
          application.owner_uid.should.be.equal(userUID)
          application.owner_uid.should.be.equal(application.user_uids[0])



          done(err)
        })
    
    })


    it('should be able to provide an applications count in response', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "count": true
        })
        .end(function(err, res) {
          var response = res.body
          
          response.applications.should.be.a('number')
          response.applications.should.not.equal(0)

          done(err)
        })
    
    });


    it('should be able to get an applications including collaborators info in response', function(done) {
      this.timeout(25000)
      factories.create('login_system_user', config.user2)
        .end(function(err, res) {
          
          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {
              
              factories.create('Get_all_applications', authtoken, {
                  "_method": "get",
                  "include_collaborators": true,
                  "query": {
                    "api_key": api_key
                  }
                })
                .end(function(err, res2) {
                  
                  var application = res2.body.applications[0]
                  
                // Keys assertion
                  Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'collaborators', 'SYS_ACL'])
                  Object.keys(application.collaborators[1]).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id', 'is_owner', 'roles'])
                  Object.keys(application.collaborators[0]).should.to.be.deep.equal(['uid', 'created_at', 'updated_at', 'email', 'username', 'plan_id', 'roles'])
                    // Data type assertion
                  application.created_at.should.be.a('string')
                  application.updated_at.should.be.a('string')
                  application.uid.should.be.a('string')
                  application.name.should.be.a('string')
                  application.api_key.should.be.a('string')
                  application.owner_uid.should.be.a('string')
                  application.user_uids.should.be.a('array')
                  application.collaborators.should.be.a('array')
                  application.SYS_ACL.should.be.a('object')

                  application.collaborators[0].uid.should.be.a('string')
                  application.collaborators[0].created_at.should.be.a('string')
                  application.collaborators[0].updated_at.should.be.a('string')
                  application.collaborators[0].email.should.be.a('string')
                  application.collaborators[0].username.should.be.a('string')
                  application.collaborators[0].plan_id.should.be.a('array')
                  application.collaborators[0].roles.should.be.a('array')

                  application.collaborators[1].uid.should.be.a('string')
                  application.collaborators[1].created_at.should.be.a('string')
                  application.collaborators[1].updated_at.should.be.a('string')
                  application.collaborators[1].email.should.be.a('string')
                  application.collaborators[1].username.should.be.a('string')
                  application.collaborators[1].plan_id.should.be.a('array')
                  application.collaborators[1].is_owner.should.be.a('boolean')
                  application.collaborators[1].roles.should.be.a('array')

                  application.collaborators[0].plan_id[0].should.be.a('string')
                  application.collaborators[1].plan_id[0].should.be.a('string')

                  //application.collaborators[1].roles[0].should.be.a('string') 

                  application.uid.length.should.be.equal(19)
                  application.api_key.length.should.be.equal(19)
                  application.owner_uid.length.should.be.equal(27)

                  application.collaborators[0].uid.length.should.be.equal(27)

                  // Value assertion
                  application.api_key.should.be.equal(api_key)
                  application.owner_uid.should.be.equal(userUID)
                  application.owner_uid.should.be.equal(application.user_uids[0])

                  application.collaborators[1].uid.should.be.equal(userUID)
                  application.collaborators[0].uid.should.not.be.equal(userUID)
                  application.collaborators[1].plan_id[0].should.be.equal('free_trial')
                  application.collaborators[0].plan_id[0].should.be.equal('free_trial')
                  application.collaborators[1].username.should.be.equal(username)
                  application.collaborators[1].email.should.be.equal(email)
                  application.collaborators[1].is_owner.should.be.equal(true)

                  //application.created_at.should.be.equal(application.updated_at)

                  done(err)
                })
            })

        })
    
    });
    

    it('should be able to get an application including application variables in response.', function(done) {
      
      factories.create('Update_app_settings', authtoken, api_key, {
          "app_settings": {
            "application_variables": {
              "test_tool": "supertest"
            }
          }
        })
        .end(function(err, res1) {
          
          factories.create('Get_all_applications', authtoken, {
              "_method": "get",
              "include_application_variables": true
            })
            .end(function(err, res2) {
              //res2.body.applications.length.should.be.equal(1)
              
              var application = R.last(res2.body.applications)
              
              // Keys assertion
              Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL', 'application_variables'])
              Object.keys(application.application_variables).should.to.be.deep.equal(['test_tool'])
              
                // Data type assertion
              application.application_variables.should.be.a('object')
              
              application.application_variables.test_tool.should.be.equal('supertest')


              done(err)
            })
        })

    });


  })


  describe('Get an applications skip/limit', function() {
    
    var app1, app2, app3

    
    before(function(done) {
      
      this.timeout(20000)
      
      R.Promisify(factories.create('Create_application', authtoken, {
          "name": "app_one"
        }))
        .then(function(res) {
          app1 = res.body.application
        })
        .then(function(res) {
          return R.Promisify(factories.create('Create_application', authtoken, {
            "name": "app_two"
          }))
        })
        .then(function(res) {
          app2 = res.body.application
        })
        .then(function(res) {
          return R.Promisify(factories.create('Create_application', authtoken, {
            "name": "app_three"
          }))
        })
        .then(function(res) {
          app3 = res.body.application
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })
    
    })

    after(function(done) {
      factories.create('Delete_application', authtoken, app1.api_key)
        .end(function(err, res) {
          
          done(err)
        })

    })

    after(function(done) {
      factories.create('Delete_application', authtoken, app2.api_key)
        .end(function(err, res) {
          
          done(err)
        })

    })


    after(function(done) {
      factories.create('Delete_application', authtoken, app3.api_key)
        .end(function(err, res) {
          
          done(err)
        })

    })


    
    it('should be able to skip number of applications while getting all apps', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "skip": 3
        })
        .end(function(err, res) {
          // R.pretty(res.body)
          res.body.applications.length.should.be.equal(1)
          var application = res.body.applications

          done(err)
        })

    });

    
    it('should be able to limit number of applications while getting all apps', function(done) {
      this.timeout(20000)
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "limit": "2"
        })
        .end(function(err, res) {
          res.body.applications.length.should.be.equal(2)
          
          done(err)

        })

    });

    
    it.skip('should provide error message for -ve skip/limit values while getting all apps', function(done) {
      factories.create('Get_all_applications', authtoken, {
          "_method": "get",
          "skip": -2,
          "limit": -2
        })
        .end(function(err, res) {
          R.pretty(res.body)
          // res.body.applications.length.should.be.equal(2)
          

          done(err)
        })

    });



  })

  
  describe('Get valid field types for an apllication', function() {
    
    it('should be able to get field datatypes supported and the various options for these fields', function(done) {
      api.get(config.endpoints.applications + config.endpoints.valid_field_types)
        .set('web_ui_api_key', config.web_ui_api_key)
        .set('authtoken', authtoken)
        .set('application_api_key', api_key)
        .expect(200)
        .end(function(err, res) {
          res.body.should.be.deep.equal({
            "field_types": [
              {
                "field_type": "text",
                "label": "Text",
                "allow_length_validations": true,
                "allow_regex": true,
                "multiple": true,
                "mandatory": true,
                "unique": true,
                "allow_field_metadata": true,
                "multiline": true,
                "allow_rich_text": true,
                "explaination": "Using this datatype we can enter string literals for the field. Additionaly you can also assign blob data."
              },
              {
                "field_type": "isodate",
                "label": "ISODate",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": true,
                "mandatory": true,
                "unique": true,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "Using this datatype you can assign either date, time or datetime values for the particular field."
              },
              {
                "field_type": "file",
                "label": "File",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": true,
                "mandatory": true,
                "unique": false,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "When you upload any asset in your built.io application, you can apply that upload's UID to this field. This will form a link between that asset and the object."
              },
              {
                "field_type": "boolean",
                "label": "Boolean",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": false,
                "mandatory": false,
                "unique": false,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "Use this datatype when you would like to add fields that can act as a switch for you. For Example: In an Invoice class, there can be a boolean field called, 'paid'"
              },
              {
                "field_type": "reference",
                "label": "Reference",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": false,
                "mandatory": true,
                "unique": false,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "You can refer to objects of other classes in your application, when you use this field."
              },
              {
                "field_type": "group",
                "label": "Group",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": true,
                "mandatory": true,
                "unique": false,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "Using this field, you can group other fields into this one. An example usage can be, an address field, which is a composite of streeet address, city, state."
              },
              {
                "field_type": "link",
                "label": "Link",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": true,
                "mandatory": true,
                "unique": true,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "Using this field you can save hyperlinks into your objects. The link field itself is composite of two fields, link title and link href."
              },
              {
                "field_type": "number",
                "label": "Number",
                "allow_length_validations": true,
                "allow_regex": false,
                "multiple": true,
                "mandatory": true,
                "unique": true,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "This datatype can be used to store numerical values."
              },
              {
                "field_type": "mixed",
                "label": "Mixed",
                "allow_length_validations": false,
                "allow_regex": false,
                "multiple": false,
                "mandatory": false,
                "unique": false,
                "allow_field_metadata": true,
                "multiline": false,
                "allow_rich_text": false,
                "explaination": "This datatype helps you save a key-value store in your object."
              }
            ]
          })

          done(err)
        })
    
    })

  
  })


  describe('Get app', function() {

    var authtoken1
    
    before(function(done) {
      // this.timeout(20000)
      R.Promisify(factories.create('login_system_user', config.user2))
      .then(function(res) {
        authtoken1 = res.body.user.authtoken
        return res
      })
      .then(function(res) {
        return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
          "emails": [
            res.body.user.email
          ]
        }))
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should be able to get application as an owner', function(done) {
      factories.create('Create_application', authtoken)
        .end(function(err, res) {
          var app = res.body.application

          factories.create('Get_application', authtoken, app.api_key)
            .end(function(err, res1) {
              var application = res1.body.application

              // Keys assertion
              Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL', 'application_variables', 'discrete_variables'])

              // Data type assertion
              application.created_at.should.be.a('string')
              application.updated_at.should.be.a('string')
              application.uid.should.be.a('string')
              application.name.should.be.a('string')
              application.api_key.should.be.a('string')
              application.owner_uid.should.be.a('string')
              application.user_uids.should.be.a('array')
              application.SYS_ACL.should.be.a('object')

              application.uid.length.should.be.equal(19)
              application.api_key.length.should.be.equal(19)
              application.master_key.length.should.be.equal(19)
              application.owner_uid.length.should.be.equal(27)
              application.user_uids.length.should.be.equal(1)

              // Value assertion
              application.api_key.should.be.equal(app.api_key)
                // bug
                //application.created_at.should.be.equal(application.updated_at)
              application.owner_uid.should.be.equal(userUID)
              application.owner_uid.should.be.equal(application.user_uids[0])

              factories.create('Delete_application', authtoken, app.api_key)
                .end(function(err, res) {
                  done(err)
                })


            })

        });
    
    });


    it('should be able to get application as a collaborator without master_key in response', function(done) {
      factories.create('Get_application', authtoken1, api_key)
        .end(function(err, res) {
          
          var application = res.body.application

          // Keys assertion
          Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'SYS_ACL', 'application_variables', 'discrete_variables'])

          // Data type assertion
          application.created_at.should.be.a('string')
          application.updated_at.should.be.a('string')
          application.uid.should.be.a('string')
          application.name.should.be.a('string')
          application.api_key.should.be.a('string')
          application.owner_uid.should.be.a('string')
          application.user_uids.should.be.a('array')
          application.SYS_ACL.should.be.a('object')
          application.application_variables.should.be.a('object')
          application.discrete_variables.should.be.a('object')

          application.uid.length.should.be.equal(19)
          application.api_key.length.should.be.equal(19)
          application.owner_uid.length.should.be.equal(27)
          application.user_uids.length.should.be.equal(2)

          // Value assertion
          application.api_key.should.be.equal(api_key)

          //bug
          //application.created_at.should.be.equal(application.updated_at)
          application.owner_uid.should.be.equal(userUID)
          application.owner_uid.should.be.equal(application.user_uids[0])
          application.owner_uid.should.not.equal(application.user_uids[1])

          done(err)
        })
    
    });


  })


  describe('Update app', function() {

    it.skip('should be able to update created application', function(done) {
      factories.create('Update_application', authtoken, api_key, {
          "name": "updated"
        })
        .end(function(err, res) {
          R.pretty(res.body)
          var application = res.body.application

          // Keys assertion
          Object.keys(application).should.to.be.deep.equal(['created_at', 'updated_at', 'uid', 'name', 'api_key', 'owner_uid', 'user_uids', 'master_key', 'SYS_ACL', 'application_variables', 'discrete_variables'])

          // Data type assertion
          application.created_at.should.be.a('string')
          application.updated_at.should.be.a('string')
          application.uid.should.be.a('string')
          application.name.should.be.a('string')
          application.api_key.should.be.a('string')
          application.owner_uid.should.be.a('string')
          application.user_uids.should.be.a('array')
          application.SYS_ACL.should.be.a('object')
          // application.user_uids[0].length.should.be.a('string')

          console.log("==", application.user_uids)
          application.uid.length.should.be.equal(19)
          application.api_key.length.should.be.equal(19)
          application.master_key.length.should.be.equal(19)
          application.owner_uid.length.should.be.equal(27)

          // Value assertion
          res.body.notice.should.be.equal('Awesome! Application updated successfully.')
          application.name.should.be.equal('updated')
          application.api_key.should.be.equal(api_key)
          application.created_at.should.be.not.equal(application.updated_at)
          application.owner_uid.should.be.equal(userUID)
          application.owner_uid.should.be.equal(application.user_uids[0])

          done(err)
        })
    
    });

    it('should not be able to update application as a collaborator', function(done) {

      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {

              factories.create('Update_application', res.body.user.authtoken, api_key, {
                  "name": "updated by collaborator"
                })
                .expect(422) //need to fix in factory
                .end(function(err, res2) {

                  var response = res2.body
                  response.error_message.should.to.be.equal('Bummer. Access denied. It seems you are not the owner of the app.')

                  done(err)
                })
            })

        })
    
    });

  
  })

  

  describe('Delete app', function() {

    it('should be able to delete careated application', function(done) {

      var appName = "Delete App"

      factories.create('Create_application', authtoken, {
          "name": appName
        })
        .end(function(err, res) {
          var application = res.body.application

          res.body.notice.should.be.equal('Hurray! Application created successfully.')

          factories.create('Delete_application', authtoken, application.api_key)
            .end(function(err, res1) {
              res1.body.notice.should.be.equal('That worked. Application deleted successfully!')

              done(err)
            })
        })
    
    });

    it('should not be able to delete application as a collaborator', function(done) {
      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {

              factories.create('Delete_application', res.body.user.authtoken, api_key)
                .expect(422) //need to fix in factory
                .end(function(err, res2) {

                  var response = res2.body
                  response.error_message.should.to.be.equal('Bummer. Access denied. It seems you are not the owner of the app.')

                  done(err)
                })
            })

        })
    
    });

  
  })

  

  describe('Reset app master key', function() {

    var authtoken3
    
    before(function(done) {
      // this.timeout(20000)
      R.Promisify(factories.create('login_system_user', config.user2))
      .then(function(res) {
        authtoken3 = res.body.user.authtoken
        return res
      })
      .then(function(res) {
        return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
          "emails": [
            res.body.user.email
          ]
        }))
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })
    

    it('should be able to reset app master key as a owner', function(done) {
      api.post(config.endpoints.applications + '/' + api_key + config.endpoints.reset_master_key)
        .set('web_ui_api_key', config.web_ui_api_key)
        .set('authtoken', authtoken)
        .set('application_api_key', api_key)
        .expect(200)
        .end(function(err, res) {

          res.body.notice.should.be.equal('OK, we\'ve generated a new master key for you.')

          factories.create('Get_application', authtoken, api_key)
            .end(function(err, res1) {

              var application = res1.body.application

              application.master_key.should.be.not.equal(master_key)

              done(err)
            })
        })
    
    });


    it('should not be able to reset app master key as a collaborator', function(done) {
      api.post(config.endpoints.applications + '/' + api_key + config.endpoints.reset_master_key)
        .set('web_ui_api_key', config.web_ui_api_key)
        .set('authtoken', authtoken3)
        .set('application_api_key', api_key)
        .expect(422)
        .end(function(err, res) {
          
          res.body.should.be.deep.equal({
            "error_message": "Bummer. Access denied. It seems you are not the owner of the app.",
            "error_code": 133,
            "errors": {}
          })          

          done(err)
          
        })
    
    });
  
  })

  

  describe('App settings', function() {

    
    it('should be able to get application settings', function(done) {
      factories.create('Get_app_settings', authtoken, api_key)
      .end(function(err, res) {
        var settings = res.body.app_settings
          // Keys assertion
        Object.keys(settings).should.to.be.deep.equal(['application_variables', 'discrete_variables', 'login_schemes', 'upload_type_restriction', 'restricted_profile_update', 'hide_email', 'allow_client_notifications', 'active_user_threshold', 'auto_create_tenants', 'activation_template', 'welcome_template', 'forgot_password_template'])

        Object.keys(settings.login_schemes).should.to.be.deep.equal(['google', 'facebook', 'twitter', 'tibbr', 'traditional', 'anyauth'])
        Object.keys(settings.upload_type_restriction).should.to.be.deep.equal(['enabled', 'whitelist', 'list'])
        Object.keys(settings.restricted_profile_update).should.to.be.deep.equal(['enabled', 'whitelist', 'keys'])
        Object.keys(settings.activation_template).should.to.be.deep.equal(['reply_to', 'subject', 'template', 'use'])
        Object.keys(settings.welcome_template).should.to.be.deep.equal(['reply_to', 'subject', 'template', 'use'])
        Object.keys(settings.forgot_password_template).should.to.be.deep.equal(['reply_to', 'subject', 'template'])


        // Data type assertion
        settings.application_variables.should.be.a('object')
        settings.discrete_variables.should.be.a('object')
        settings.login_schemes.should.be.a('object')
        settings.upload_type_restriction.should.be.a('object')
        settings.restricted_profile_update.should.be.a('object')

        settings.hide_email.should.be.a('boolean')
        settings.allow_client_notifications.should.be.a('boolean')
        settings.active_user_threshold.should.be.a('number')
        settings.auto_create_tenants.should.be.a('boolean')

        settings.activation_template.should.be.a('object')
        settings.welcome_template.should.be.a('object')
        settings.forgot_password_template.should.be.a('object')

        settings.login_schemes.google.should.be.a('boolean')
        settings.login_schemes.facebook.should.be.a('boolean')
        settings.login_schemes.twitter.should.be.a('boolean')
        settings.login_schemes.tibbr.should.be.a('boolean')
        settings.login_schemes.traditional.should.be.a('boolean')
        settings.login_schemes.anyauth.should.be.a('boolean')

        settings.upload_type_restriction.enabled.should.be.a('boolean')
        settings.upload_type_restriction.whitelist.should.be.a('boolean')
        settings.upload_type_restriction.list.should.be.a('array')

        settings.restricted_profile_update.enabled.should.be.a('boolean')
        settings.restricted_profile_update.whitelist.should.be.a('boolean')
        settings.restricted_profile_update.keys.should.be.a('array')

        settings.activation_template.reply_to.should.be.a('string')
        settings.activation_template.subject.should.be.a('string')
        settings.activation_template.template.should.be.a('string')
        settings.activation_template.use.should.be.a('boolean')

        settings.welcome_template.reply_to.should.be.a('string')
        settings.welcome_template.subject.should.be.a('string')
        settings.welcome_template.template.should.be.a('string')
        settings.welcome_template.use.should.be.a('boolean')

        settings.forgot_password_template.reply_to.should.be.a('string')
        settings.forgot_password_template.subject.should.be.a('string')
        settings.forgot_password_template.template.should.be.a('string')


        // Value assertion
        settings.login_schemes.google.should.be.equal(true)
        settings.login_schemes.facebook.should.be.equal(true)
        settings.login_schemes.twitter.should.be.equal(true)
        settings.login_schemes.tibbr.should.be.equal(true)
        settings.login_schemes.traditional.should.be.equal(true)
        settings.login_schemes.anyauth.should.be.equal(true)

        settings.upload_type_restriction.enabled.should.be.equal(false)
        settings.upload_type_restriction.whitelist.should.be.equal(true)
        settings.upload_type_restriction.list.should.be.deep.equal([])

        settings.restricted_profile_update.enabled.should.be.equal(false)
        settings.restricted_profile_update.whitelist.should.be.equal(true)
        settings.restricted_profile_update.keys.should.be.deep.equal([])


        settings.hide_email.should.be.equal(false)
        settings.allow_client_notifications.should.be.equal(false)
        settings.active_user_threshold.should.be.equal(15)
        settings.auto_create_tenants.should.be.equal(false)


        settings.activation_template.reply_to.should.be.equal('noreply@built.io')
        settings.activation_template.subject.should.be.equal('Activate Your Account')
        settings.activation_template.template.should.be.equal('<p>Hi!</p>\n\n<p>\n  Thank you for creating an account!\n</p>\n\n<p>\n  Please <a href="{{confirm_link}}">confirm</a> your account to continue.\n</p>\n\n<p>\nIf you have any problems, please feel free to contact us.\n</p>\n\n<br/>\n\n<p>\n  Cheers.\n</p>')
        settings.activation_template.use.should.be.equal(true)

        settings.welcome_template.reply_to.should.be.equal('noreply@built.io')
        settings.welcome_template.subject.should.be.equal('Welcome!')
        settings.welcome_template.template.should.be.equal('<p>\n  Hi!\n</p>\n<p>\n  Welcome to {{app_name}}.\n  <br/>\n  <br/>\n  Your registration has been confirmed successfully.\n</p>\n\n<p>\n  Cheers\n</p>')
        settings.welcome_template.use.should.be.equal(true)

        settings.forgot_password_template.reply_to.should.be.equal('noreply@built.io')
        settings.forgot_password_template.subject.should.be.equal('Reset Your Password')
        settings.forgot_password_template.template.should.be.equal('<p>Hi!</p>\n\n<p>\n  You (or someone else) have requested to reset your password for {{app_name}}.\n</p>\n\n<p>\n  If you follow the link below you will be able to personally reset your password\n</p>\n\n<br />\n{{reset_password_link}}\n\n<p>Cheers</p>')

        done(err)
      })
    
    });

    
    it('should be able to update application settings', function(done) {
      factories.create('Update_app_settings', authtoken, api_key, {
          "app_settings": {
            "application_variables": {
              "test_tool": "supertest"
            },
            "discrete_variables": {
              "supertest": "is a nodejs test tool"
            },
            "activation_template": {
              "subject": "activation_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "the mail activation template",
              "use": "true"
            },
            "welcome_template": {
              "subject": "welcome_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "the mail welcome template",
              "use": "true"
            },
            "forgot_password_template": {
              "subject": "forgot_password_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "forgot password template"
            },
            "application_variables": {
              "testing_tool": "using supertest and mocha"
            },
            "allow_client_notifications": "true",
            "active_user_threshold": "20",
            "auto_create_tenants": "false"
          }
        })
        .end(function(err, res) {
          var settings = res.body.app_settings
          
          res.body.notice.should.be.equal('Awesome! The application settings were updated successfully.')

          // Keys assertion
          Object.keys(settings).should.to.be.deep.equal(['application_variables', 'discrete_variables', 'login_schemes', 'upload_type_restriction', 'restricted_profile_update', 'hide_email', 'allow_client_notifications', 'active_user_threshold', 'auto_create_tenants', 'activation_template', 'welcome_template', 'forgot_password_template'])

          Object.keys(settings.login_schemes).should.to.be.deep.equal(['google', 'facebook', 'twitter', 'tibbr', 'traditional', 'anyauth'])
          Object.keys(settings.upload_type_restriction).should.to.be.deep.equal(['enabled', 'whitelist', 'list'])
          Object.keys(settings.restricted_profile_update).should.to.be.deep.equal(['enabled', 'whitelist', 'keys'])
          Object.keys(settings.activation_template).should.to.be.deep.equal(['subject', 'reply_to', 'template', 'use'])
          Object.keys(settings.welcome_template).should.to.be.deep.equal(['subject', 'reply_to', 'template', 'use'])
          Object.keys(settings.forgot_password_template).should.to.be.deep.equal(['subject', 'reply_to', 'template'])


          // Data type assertion
          settings.application_variables.should.be.a('object')
          settings.discrete_variables.should.be.a('object')
          settings.login_schemes.should.be.a('object')
          settings.upload_type_restriction.should.be.a('object')
          settings.restricted_profile_update.should.be.a('object')

          settings.hide_email.should.be.a('boolean')
          settings.allow_client_notifications.should.be.a('boolean')
          settings.active_user_threshold.should.be.a('number')
          settings.auto_create_tenants.should.be.a('boolean')

          settings.activation_template.should.be.a('object')
          settings.welcome_template.should.be.a('object')
          settings.forgot_password_template.should.be.a('object')

          settings.login_schemes.google.should.be.a('boolean')
          settings.login_schemes.facebook.should.be.a('boolean')
          settings.login_schemes.twitter.should.be.a('boolean')
          settings.login_schemes.tibbr.should.be.a('boolean')
          settings.login_schemes.traditional.should.be.a('boolean')
          settings.login_schemes.anyauth.should.be.a('boolean')

          settings.upload_type_restriction.enabled.should.be.a('boolean')
          settings.upload_type_restriction.whitelist.should.be.a('boolean')
          settings.upload_type_restriction.list.should.be.a('array')

          settings.restricted_profile_update.enabled.should.be.a('boolean')
          settings.restricted_profile_update.whitelist.should.be.a('boolean')
          settings.restricted_profile_update.keys.should.be.a('array')

          settings.activation_template.reply_to.should.be.a('string')
          settings.activation_template.subject.should.be.a('string')
          settings.activation_template.template.should.be.a('string')
          settings.activation_template.use.should.be.a('boolean')

          settings.welcome_template.reply_to.should.be.a('string')
          settings.welcome_template.subject.should.be.a('string')
          settings.welcome_template.template.should.be.a('string')
          settings.welcome_template.use.should.be.a('boolean')

          settings.forgot_password_template.reply_to.should.be.a('string')
          settings.forgot_password_template.subject.should.be.a('string')
          settings.forgot_password_template.template.should.be.a('string')


          // Value assertion
          settings.login_schemes.google.should.be.equal(true)
          settings.login_schemes.facebook.should.be.equal(true)
          settings.login_schemes.twitter.should.be.equal(true)
          settings.login_schemes.tibbr.should.be.equal(true)
          settings.login_schemes.traditional.should.be.equal(true)
          settings.login_schemes.anyauth.should.be.equal(true)

          settings.upload_type_restriction.enabled.should.be.equal(false)
          settings.upload_type_restriction.whitelist.should.be.equal(true)
          settings.upload_type_restriction.list.should.be.deep.equal([])

          settings.restricted_profile_update.enabled.should.be.equal(false)
          settings.restricted_profile_update.whitelist.should.be.equal(true)
          settings.restricted_profile_update.keys.should.be.deep.equal([])

          settings.hide_email.should.be.equal(false)
          settings.allow_client_notifications.should.be.equal(true)
          settings.active_user_threshold.should.be.equal(20)
          settings.auto_create_tenants.should.be.equal(false)

          settings.activation_template.reply_to.should.be.equal('swapnil.shirke@raweng.com')
          settings.activation_template.subject.should.be.equal('activation_template')
          settings.activation_template.template.should.be.equal('the mail activation template')
          settings.activation_template.use.should.be.equal(true)

          settings.welcome_template.reply_to.should.be.equal('swapnil.shirke@raweng.com')
          settings.welcome_template.subject.should.be.equal('welcome_template')
          settings.welcome_template.template.should.be.equal('the mail welcome template')
          settings.welcome_template.use.should.be.equal(true)

          settings.forgot_password_template.reply_to.should.be.equal('swapnil.shirke@raweng.com')
          settings.forgot_password_template.subject.should.be.equal('forgot_password_template')
          settings.forgot_password_template.template.should.be.equal('forgot password template')

          settings.application_variables.testing_tool.should.be.equal('using supertest and mocha')
          settings.discrete_variables.supertest.should.be.equal('is a nodejs test tool')

          done(err)

        })
    
    });

    
    it('should be able to reset application settings', function(done) {
      factories.create('Update_app_settings', authtoken, api_key, {
          "app_settings": {
            "activation_template": {
              "subject": "activation_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "the mail activation template",
              "use": "true"
            },
            "welcome_template": {
              "subject": "welcome_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "the mail welcome template",
              "use": "true"
            },
            "forgot_password_template": {
              "subject": "forgot_password_template",
              "reply_to": "swapnil.shirke@raweng.com",
              "template": "forgot password template"
            },
            "application_variables": {
              "testing_tool": "using 'supertest and mocha'"
            },
            "allow_client_notifications": "true",
            "active_user_threshold": "20",
            "auto_create_tenants": "false"
          }
        })
        .end(function(err, res) {

          factories.create('reset_app_settings', authtoken, api_key, {
              "scope": {
                "activation_template": []
              }
            })
            .end(function(err, res) {
              var settings = res.body.app_settings

              res.body.notice.should.be.equal('Awesome! The application settings were updated successfully.')

              
              // Keys assertion
              Object.keys(settings).should.to.be.deep.equal(['application_variables', 'discrete_variables', 'login_schemes', 'upload_type_restriction', 'restricted_profile_update', 'hide_email', 'allow_client_notifications', 'active_user_threshold', 'auto_create_tenants', 'activation_template', 'welcome_template', 'forgot_password_template'])

              Object.keys(settings.login_schemes).should.to.be.deep.equal(['google', 'facebook', 'twitter', 'tibbr', 'traditional', 'anyauth'])
              Object.keys(settings.upload_type_restriction).should.to.be.deep.equal(['enabled', 'whitelist', 'list'])
              Object.keys(settings.restricted_profile_update).should.to.be.deep.equal(['enabled', 'whitelist', 'keys'])

              // order is not static need to change

              // Object.keys(settings.activation_template).should.to.be.deep.equal(['subject', 'reply_to', 'template', 'use'])
              // Object.keys(settings.welcome_template).should.to.be.equal(['subject', 'template', 'use', 'reply_to'])
              // Object.keys(settings.forgot_password_template).should.to.be.equal(['reply_to', 'subject', 'template'])


              // Data type assertion
              settings.application_variables.should.be.a('object')
              settings.discrete_variables.should.be.a('object')
              settings.login_schemes.should.be.a('object')
              settings.upload_type_restriction.should.be.a('object')
              settings.restricted_profile_update.should.be.a('object')

              settings.hide_email.should.be.a('boolean')
              settings.allow_client_notifications.should.be.a('boolean')
              settings.active_user_threshold.should.be.a('number')
              settings.auto_create_tenants.should.be.a('boolean')

              settings.activation_template.should.be.a('object')
              settings.welcome_template.should.be.a('object')
              settings.forgot_password_template.should.be.a('object')

              settings.login_schemes.google.should.be.a('boolean')
              settings.login_schemes.facebook.should.be.a('boolean')
              settings.login_schemes.twitter.should.be.a('boolean')
              settings.login_schemes.tibbr.should.be.a('boolean')
              settings.login_schemes.traditional.should.be.a('boolean')
              settings.login_schemes.anyauth.should.be.a('boolean')

              settings.upload_type_restriction.enabled.should.be.a('boolean')
              settings.upload_type_restriction.whitelist.should.be.a('boolean')
              settings.upload_type_restriction.list.should.be.a('array')

              settings.restricted_profile_update.enabled.should.be.a('boolean')
              settings.restricted_profile_update.whitelist.should.be.a('boolean')
              settings.restricted_profile_update.keys.should.be.a('array')

              settings.activation_template.reply_to.should.be.a('string')
              settings.activation_template.subject.should.be.a('string')
              settings.activation_template.template.should.be.a('string')
              settings.activation_template.use.should.be.a('boolean')

              settings.welcome_template.reply_to.should.be.a('string')
              settings.welcome_template.subject.should.be.a('string')
              settings.welcome_template.template.should.be.a('string')
              settings.welcome_template.use.should.be.a('boolean')

              settings.forgot_password_template.reply_to.should.be.a('string')
              settings.forgot_password_template.subject.should.be.a('string')
              settings.forgot_password_template.template.should.be.a('string')


              // Value assertion
              settings.login_schemes.google.should.be.equal(true)
              settings.login_schemes.facebook.should.be.equal(true)
              settings.login_schemes.twitter.should.be.equal(true)
              settings.login_schemes.tibbr.should.be.equal(true)
              settings.login_schemes.traditional.should.be.equal(true)
              settings.login_schemes.anyauth.should.be.equal(true)

              settings.upload_type_restriction.enabled.should.be.equal(false)
              settings.upload_type_restriction.whitelist.should.be.equal(true)
              settings.upload_type_restriction.list.should.be.deep.equal([])

              settings.restricted_profile_update.enabled.should.be.equal(false)
              settings.restricted_profile_update.whitelist.should.be.equal(true)
              settings.restricted_profile_update.keys.should.be.deep.equal([])


              settings.hide_email.should.be.equal(false)
              settings.allow_client_notifications.should.be.equal(true)
              settings.active_user_threshold.should.be.equal(20)
              settings.auto_create_tenants.should.be.equal(false)


              settings.activation_template.reply_to.should.be.equal('noreply@built.io')
              settings.activation_template.subject.should.be.equal('Activate Your Account')
              settings.activation_template.template.should.be.equal('<p>Hi!</p>\n\n<p>\n  Thank you for creating an account!\n</p>\n\n<p>\n  Please <a href="{{confirm_link}}">confirm</a> your account to continue.\n</p>\n\n<p>\nIf you have any problems, please feel free to contact us.\n</p>\n\n<br/>\n\n<p>\n  Cheers.\n</p>')
              settings.activation_template.use.should.be.equal(true)

              settings.welcome_template.reply_to.should.be.equal('swapnil.shirke@raweng.com')
              settings.welcome_template.subject.should.be.equal('welcome_template')
              settings.welcome_template.template.should.be.equal('the mail welcome template')
              settings.welcome_template.use.should.be.equal(true)

              settings.forgot_password_template.reply_to.should.be.equal('swapnil.shirke@raweng.com')
              settings.forgot_password_template.subject.should.be.equal('forgot_password_template')
              settings.forgot_password_template.template.should.be.equal('forgot password template')

              done(err)

            });
        });
    
    });

  
  })



  describe('Collaborators invite and unaccepted_invitations', function() {


    before(function(done) {
      // this.timeout(20000)
      R.Promisify(factories.create('login_system_user', config.user2))
      .then(function(res) {
        authtoken1 = res.body.user.authtoken
        return res
      })
      .then(function(res) {
        return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
          "emails": [
            res.body.user.email
          ]
        }))
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })
    


    it('should be able to get all collaborators present in an application', function(done) {
      
      R.Promisify(factories.create('login_system_user', config.user2))
      .then(function(res) {
        collaborator = res.body.user
        return res
      })
      .then(function(res) {
        return R.Promisify(factories.create('invite_collaborator', authtoken, api_key, {
          "emails": [
            res.body.user.email
          ]
        }))
      })
      .then(function(res) {
        return R.Promisify(factories.create('Get_collaborators', authtoken, api_key)) 
      })
      .then(function(res) {
        
        users = res.body.users

        Object.keys(users[0]).should.to.be.deep.equal(['uid','created_at','updated_at','email','username','plan_id','roles'])
        Object.keys(users[1]).should.to.be.deep.equal(['uid','created_at','updated_at','email','username','plan_id','is_owner','roles'])

        users[0].email.should.be.equal(collaborator.email)
        users[1].email.should.be.equal(email)
        users[1].is_owner.should.be.equal(true)
      })
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    

    });


    it('should be able to invite collaborators for an application', function(done) {
      factories.create('invite_collaborator', authtoken, api_key, {
          "emails": [
            "test1user@mailinator.com",
            "test2user@mailinator.com"
          ]
        })
        .end(function(err, res) {

          var response = res.body

          response.notice.should.be.equal('The invitation has been sent successfully.')
          done(err)
        })
    
    });

    
    it('should be able to get unaccepted invitations for an application', function(done) {

      api.get(config.endpoints.applications + "/" + api_key + config.endpoints.unaccepted_invitations)
        .set('web_ui_api_key', config.web_ui_api_key)
        .set('authtoken', authtoken)
        .set('application_api_key', api_key)
        .expect(200)
        .end(function(err, res1) {

          var response = res1.body

          response.emails.should.be.deep.equal([
            "test1user@mailinator.com",
            "test2user@mailinator.com"
          ])

          done(err)
        })
    
    });

  
  })



  describe('App unshare', function() {

    
    it('should be able to unshare application from collaborator as a system user', function(done) {

      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {

              factories.create('unshare_application', authtoken, api_key, {
                  "unshare_from": res.body.user.email
                })
                .expect(200)
                .end(function(err, res2) {
                  var response = res2.body

                  response.notice.should.to.be.equal('The application has been successfully unshared.')

                  done(err)
                })
            })

        })
    
    });

    
    it('should be able to unshare collaborator application as a collaborator', function(done) {

      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {

              factories.create('unshare_application', res.body.user.authtoken, api_key)
                .expect(200)
                .end(function(err, res2) {
                  var response = res2.body

                  response.notice.should.to.be.equal('The application has been successfully unshared.')

                  done(err)
                })
            })

        })
    
    });


    it('should provide error message when collaborators email is invalid', function(done) {

      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                "swapnil@mailinator.com"
              ]
            })
            .end(function(err, res1) {

              factories.create('unshare_application', res.body.user.authtoken, api_key)
                .expect(422)
                .end(function(err, res3) {
                  var response = res3.body
                  
                  response.should.to.be.deep.equal({
                    "error_message": "Bummer. Access denied. You need to be a collaborator before accessing this app.",
                    "error_code": 133,
                    "errors": {}
                  })

                  done(err)
                })
            })

        })
    
    });


    it('should provide error message when user is not a collaborator for given application', function(done) {

      factories.create('login_system_user', config.user2)
        .end(function(err, res) {

          factories.create('invite_collaborator', authtoken, api_key, {
              "emails": [
                res.body.user.email
              ]
            })
            .end(function(err, res1) {

              factories.create('unshare_application', res.body.user.authtoken, api_key)
                .expect(200)
                .end(function(err, res2) {
                  var response = res2.body

                  response.notice.should.to.be.equal('The application has been successfully unshared.')

                  factories.create('unshare_application', res.body.user.authtoken, api_key)
                  .end(function(err, res) {
                    // R.pretty(res.body)
                    res.body.should.be.deep.equal({
                      "error_message": "Bummer. Access denied. You need to be a collaborator before accessing this app.",
                      "error_code": 133,
                      "errors": {}
                    })

                    done(err)
                  })
                })
            })

        })
    
    });



  })

  

  describe('App Transfer/Accept Ownership', function() {

    var email = config.user2.email
    
    it('should be able to transfer app ownership to registered system users', function(done) {
      factories.create('Get_application', authtoken, api_key)
        .end(function(err, res1) {

          api.post(config.endpoints.applications + '/' + api_key + config.endpoints.transfer_ownership)
            .set('web_ui_api_key', config.web_ui_api_key)
            .set('authtoken', authtoken)
            .set('application_api_key', api_key)
            .send({
              "transfer_to": email
            })
            .expect(200)
            .end(function(err, res) {
              // R.pretty(res.body)
              res.body.notice.should.be.equal('An email has been sent to '+ config.user2.email +' about transferring ownership of \'' + res1.body.application.name + '\'. The ownership will be transferred after the other user accepts ownership.')

              done(err)
            })
        })
    
    })

    
    it('should give error for transfer app ownership to non-registered system users', function(done) {
      factories.create('Get_application', authtoken, api_key)
        .end(function(err, res1) {

          api.post(config.endpoints.applications + '/' + api_key + config.endpoints.transfer_ownership)
            .set('web_ui_api_key', config.web_ui_api_key)
            .set('authtoken', authtoken)
            .set('application_api_key', api_key)
            .send({
              "transfer_to": "non_registered@mailinator.com"
            })
            .expect(422)
            .end(function(err, res) {
              // R.pretty(res.body)
              res.body.should.be.deep.equal({
                "error_message": "Sorry about that. non_registered@mailinator.com is not registered in Built.io Backend. Create an account first.",
                "error_code": 179,
                "errors": {}
              })

              done(err)
            })
        })
    
    })


    it.skip('should be able to accept application ownership', function(done) {

    });

  
  });



})