describe('General settings ---', function() {
  var sys_user1
  var app1


  before(function(done) {
    this.timeout(45000)
    R.Promisify(factories.create('login_system_user'))
      .then(function(res) {
        sys_user1 = res.body.user
      })
      .then(function(res) {
        return R.Promisify(factories.create('Create_application', sys_user1.authtoken))
      })
      .then(function(res) {
        app1 = res.body.application
      })
      .then(function(res) {
        return factories.create('create_objects', 2, sys_user1.authtoken, app1.api_key, 'built_io_application_user', [{
          "published": true,
          "active": true,
          "username": "userOne",
          "email": "userThree@mailinator.com",
          "password": "raw123",
          "password_confirmation": "raw123"
        },{
          "published": true,
          "active": true,
          "username": "userTwo",
          "email": "userFour@mailinator.com",
          "password": "raw123",
          "password_confirmation": "raw123"
        }])
      })
      .then(function(res) {
        return R.Promisify(factories.create('get_all_objects', sys_user1.authtoken, app1.api_key, 'built_io_application_user', ''))
      })
      .then(function(res) {
        user1 = res.body.objects[0]
        user2 = res.body.objects[1]
      })
      .then(function(res) {
        return R.Promisify(factories.create('login_app_user', app1.api_key, {
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
        return R.Promisify(factories.create('login_app_user', app1.api_key, {
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
        console.log(err)
      })

  })


  after(function(done) {
    factories.create('Delete_application', sys_user1.authtoken, app1.api_key)
      .end(function(err, res1) {
        //console.log("application delete")
        done(err)
      })

  })





  describe('uploads whitelist restrictions', function() {

    var filename1 = 'png_1.png'
    var filename2 = 'jpg_1.JPG'
    var filename3 = 'json_1.json'

    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "upload_type_restriction": {
            "enabled": true,
            "whitelist": true,
            "list": ["image/png", "image/jpeg"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    })



    it('should restrict whitelisted files only', function(done) {
      R.Promisify(factories.create('create_upload', appUser1.authtoken, app1.api_key, filename1))
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('image/png')
        })
        .then(function(res) {
          return R.Promisify(factories.create('create_upload', sys_user1.authtoken, app1.api_key, filename2))
        })
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('image/jpeg')
        })
        .then(function(res) {
          return R.Promisify(factories.create('create_upload', appUser2.authtoken, app1.api_key, filename3))
        })
        .then(function(res) {
          res.body.error_message.should.be.equal('Bummer. File creation failed. Please try again.')
          res.body.error_code.should.be.equal(142)
          res.body.errors[0].should.be.deep.equal({ content_type: 'is not included in the list of valid values' })
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })



    });


  });


  describe('uploads blacklist restrictions', function() {

    var filename1 = 'png_1.png'
    var filename2 = 'jpg_1.JPG'
    var filename3 = 'json_1.json'
    var filename4 = 'pdf_1.pdf'

    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "upload_type_restriction": {
            "enabled": true,
            "whitelist": false,
            "list": ["image/png", "image/jpeg"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    })



    it('should restrict blackted files only', function(done) {
      R.Promisify(factories.create('create_upload', appUser1.authtoken, app1.api_key, filename1))
        .then(function(res) {
          res.body.error_message.should.be.equal('Bummer. File creation failed. Please try again.')
          res.body.error_code.should.be.equal(142)
          res.body.errors[0].should.be.deep.equal({ content_type: 'is not included in the list of valid values' })
        })
        .then(function(res) {
          return R.Promisify(factories.create('create_upload', sys_user1.authtoken, app1.api_key, filename2))
        })
        .then(function(res) {
          res.body.error_message.should.be.equal('Bummer. File creation failed. Please try again.')
          res.body.error_code.should.be.equal(142)
          res.body.errors[0].should.be.deep.equal({ content_type: 'is not included in the list of valid values' })
        })
        .then(function(res) {
          return R.Promisify(factories.create('create_upload', appUser2.authtoken, app1.api_key, filename3))
        })
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('application/json')
        })
        .then(function(res) {
          return R.Promisify(factories.create('create_upload', sys_user1.authtoken, app1.api_key, filename4))
        })
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('application/pdf')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })


    });


  });


  describe('uploads restrictions on update object', function() {

    var filename1 = 'png_1.png'
    var filename2 = 'jpg_1.JPG'
    var filename3 = 'json_1.json'

    var userFile 

    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "upload_type_restriction": {
            "enabled": true,
            "whitelist": true,
            "list": ["image/png", "image/jpeg"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    })



    it('should restrict whitelisted files only', function(done) {
      R.Promisify(factories.create('create_upload', appUser1.authtoken, app1.api_key, filename1))
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('image/png')
          userFile = res.body.upload
        })
        .then(function(res) {
          return R.Promisify(factories.create('update_upload', sys_user1.authtoken, app1.api_key, userFile.uid, filename3))
        })
        .then(function(res) {
          res.body.should.be.deep.equal({
            "error_message": "Bummer. File update failed. Please try again.",
            "error_code": 143,
            "errors": [
              {
                "content_type": "is not included in the list of valid values"
              }
            ]
          }          )
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })



    });


  });


  describe('uploads disable restrictions', function() {

    var filename1 = 'png_1.png'
    var filename2 = 'jpg_1.JPG'
    var filename3 = 'json_1.json'

    var userFile 

    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "upload_type_restriction": {
            "enabled": false,
            "whitelist": true,
            "list": ["image/png", "image/jpeg"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    })



    it('should disable restrictions on whitelisted files', function(done) {
      R.Promisify(factories.create('create_upload', appUser1.authtoken, app1.api_key, filename1))
        .then(function(res) {
          res.body.notice.should.be.equal('Woot! File created successfully.')
          res.body.upload.content_type.should.be.equal('image/png')
          userFile = res.body.upload
        })
        .then(function(res) {
          return R.Promisify(factories.create('update_upload', sys_user1.authtoken, app1.api_key, userFile.uid, filename3))
        })
        .then(function(res) {
          res.body.notice.should.be.deep.equal('Woot! File updated successfully.')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })



    });


  });







  describe('users profile whitelist restrictions', function() {

    
    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "restricted_profile_update": {
            "enabled": true,
            "whitelist": true,
            "keys": ["first_name", "username"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should restrict whitelisted files only', function(done) {
      R.Promisify(factories.create('update_register_app_user', appUser2.authtoken, app1.api_key, appUser1.uid, {
          "application_user": {
            "username": "superman",
            "first_name": "superman",
            "last_name": "superman"
          }
        }))
        .then(function(res) {
          user = res.body.application_user
          user.username.should.be.equal('superman')
          user.first_name.should.be.equal('superman')
          // user.last_name.should.be.equal('superman')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err.trace)
        })


    });


  });


  describe('users profile blacklist restrictions', function() {
    
    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "restricted_profile_update": {
            "enabled": true,
            "whitelist": false,
            "keys": ["first_name", "username"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should restrict whitelisted files only', function(done) {
      R.Promisify(factories.create('update_register_app_user', appUser1.authtoken, app1.api_key, appUser1.uid, {
          "application_user": {
            "first_name": "superman",
            "last_name": "superman",
            "username": "superman"
          }
        }))
        .then(function(res) {
          user = res.body.application_user
          user.username.should.be.equal(user1.username)
          user.last_name.should.be.equal('superman')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })

    });


  });


  describe('users profile disable restrictions', function() {
    
    before(function(done) {
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "restricted_profile_update": {
            "enabled": false,
            "whitelist": true,
            "keys": ["first_name", "username"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should restrict whitelisted files only', function(done) {
      R.Promisify(factories.create('update_register_app_user', appUser2.authtoken, app1.api_key, appUser1.uid, {
          "application_user": {
            "first_name": "superman",
            "last_name": "superman",
            "username": "superman"
          }
        }))
        .then(function(res) {
          user = res.body.application_user
          user.username.should.be.equal('superman')
          user.first_name.should.be.equal('superman')
          user.last_name.should.be.equal('superman')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })


    });


  });

  
  describe('users restriced profile ', function() {
    
    before(function(done) {
      
      R.Promisify(factories.create('Update_app_settings', sys_user1.authtoken, app1.api_key, {
        "app_settings": {
          "restricted_profile_update": {
            "enabled": true,
            "whitelist": true,
            "keys": ["first_name", "username"]
          }
        }
      }))
      .then(function(res) {
        done()
      })
      .catch(function(err) {
        console.log(err)
      })
    
    })


    it('should be update by system user', function(done) {
      this.timeout(30000)
      R.Promisify(factories.create('update_object_app_user', sys_user1.authtoken, app1.api_key, appUser1.uid, {
          "object": {
            "username": "hulk",
            "first_name": "hulk",
            "last_name": "hulk"
          }
        }))
        .then(function(res) {
          user = res.body.object

          user.username.should.be.equal('hulk')
          user.first_name.should.be.equal('hulk')
          user.last_name.should.be.equal('hulk')
        })
        .then(function(res) {
          done()
        })
        .catch(function(err) {
          console.log(err)
        })


    });


  });


  describe.skip('Federated login', function() {

    var e = function(u) {
      return encodeURIComponent(u);
    }
    var base = 'https://accounts.google.com/o/oauth2/auth';
    var response_type = e('token');
    var client_id = e('969047238720-20r228jrpv3gsecp56egpvvpdi68pcec.apps.googleusercontent.com');
    var redirect_uri = e('http://google.com');
    var scope = e('https://www.googleapis.com/auth/userinfo.email');
    var state = e('lollalal');
    var approval_prompt = e('auto');

    base = base +
      '?response_type=' + response_type +
      '&client_id=' + client_id +
      '&redirect_uri=' + redirect_uri +
      '&scope=' + scope +
      '&state=' + state +
      '&approval_prompt=' + approval_prompt;

    it('should have google Federated Login', function(done) {
      // R.pretty(base)
      R.Promisify(api.get(base))
      .then(function(res) {
        console.log(res.body)
      })
      .then(function(res) {
        done()
      })
    });
  

  });




})