
//---------------- applications

	factories.addFactory('login_system_user', function(body) {

		body = body || config.user1

		return api.post(config.endpoints.admin_user_session)
			.set('web_ui_api_key', config.web_ui_api_key)
			.send({
				'user': body
			})
			.expect(200)
	})

	factories.addFactory('Create_application', function(authtoken, data) {
		data = data || {
			name: 'new app'
		}

		return api.post(config.endpoints.applications)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.send({
				'application': data
			})
			.expect(201)
	})


	factories.addFactory('Delete_application', function(authtoken, api_key) {
		return api.delete(config.endpoints.applications + "/" + api_key)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			//.expect(200)
	})


	factories.addFactory('Get_all_applications', function(authtoken, body) {

		body = body || {
			"_method": "get"
		}

		return api.post(config.endpoints.applications)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.send(body)
			.expect(200)
	})


	factories.addFactory('Get_application', function(authtoken, api_key) {
		return api.get(config.endpoints.applications + "/" + api_key)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.expect(200)
	})


	factories.addFactory('Update_application', function(authtoken, api_key, body) {

		body = body || {}

		return api.put(config.endpoints.applications + "/" + api_key)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send({
				"application": body
			})
			// .expect(200)
	})


	factories.addFactory('Get_app_settings', function(authtoken, api_key) {
		return api.get(config.endpoints.applications + "/" + api_key + config.endpoints.app_settings)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.expect(200)
	})


	factories.addFactory('Update_app_settings', function(authtoken, api_key, body) {
		
		body = body || {
			"app_settings": {
				"application_variables": {
					"Api_test_tool": "supettest using mocha"
				}
			}
		}

		return api.post(config.endpoints.applications + "/" + api_key + config.endpoints.app_settings)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(201)
	})

	factories.addFactory('reset_app_settings', function(authtoken, api_key, body) {

		body = body || {
			"scope": {
				"activation_template": [
					"subject"
				],
				"welcome_template": [
					"subject",
					"reply_to",
					"use"
				],
				"forgot_password_template": [
					"subject",
					"reply_to",
					"template"
				]
			}
		}

		return api.post(config.endpoints.applications + "/" + api_key + config.endpoints.reset_settings)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(201)
	})

	factories.addFactory('invite_collaborator', function(authtoken, api_key, body) {
		// console.log(body)
		body = body || {
			"emails": [
				"test1user@mailinator.com",
				"test2user@mailinator.com"
			]
		}

		return api.post(config.endpoints.applications + "/" + api_key + config.endpoints.invite_collaborator)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})


	factories.addFactory('unshare_application', function(authtoken, api_key, body) {

		body = body || {}

		return api.post(config.endpoints.applications + "/" + api_key + config.endpoints.unshare)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})

//---------------- system roles

	factories.addFactory('Create_system_role', function(authtoken, api_key, data) {
		data = data || {
			name: 'custom_role'
		}

		return api.post(config.endpoints.system_roles)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send({
				'system_role': data
			})
			//.expect(201)
	})


	factories.addFactory('Get_system_roles', function(authtoken, api_key, body) {

		body = body || { }

		return api.get(config.endpoints.system_roles)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)
	})


	factories.addFactory('Update_system_role', function(authtoken, api_key, role_uid, body) {

		body = body || {}

		return api.put(config.endpoints.system_roles + "/" + role_uid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send({
				"system_role": body
			})
			// .expect(200)
	})


	factories.addFactory('Get_single_role', function(authtoken, api_key, role_uid) {
		return api.get(config.endpoints.system_roles + "/" + role_uid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('delete_system_role', function(authtoken, api_key, role_uid, body) {

		return api.delete(config.endpoints.system_roles + "/" + role_uid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.expect(200)
	})

//---------------- classes

	factories.addFactory('Get_all_classes', function(authtoken, api_key, body) {

		body = body || {}

		return api.post(config.endpoints.classes)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Create_class', function(authtoken, api_key, body) {

		body = body || {
			"class": {
				"title": "supertest class",
				"uid": "supertest_class",
				"schema": [{
					"multiple": false,
					"mandatory": true,
					"display_name": "Name",
					"uid": "name",
					"data_type": "text",
					"unique": "local"
				}]
			}
		}

		return api.post(config.endpoints.classes)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Update_class', function(authtoken, api_key, classUid, body) {

		body = body || {}
		
		return api.put(config.endpoints.classes + "/" + classUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Get_a_class', function(authtoken, api_key, classUid, body) {

		return api.get(config.endpoints.classes + "/" + classUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Delete_class', function(authtoken, api_key, classUid, body) {

		body = body || {}

		return api.delete(config.endpoints.classes + "/" + classUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})

//---------------- objects

	factories.addFactory('Create_object', function(authtoken, api_key, classUid, body, tenant_uid) {
		
		body = body || {}
		
		var call = api.post(config.endpoints.classes + "/" + classUid + "/" + "objects")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)

			if(tenant_uid)
				call.set('tenant_uid', tenant_uid)

		return call
	})

	factories.addFactory('get_object', function(authtoken, api_key, classUid, objectId, body) {	
		
		return api.get(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/" + objectId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)
	})

	factories.addFactory('get_revisions', function(authtoken, api_key, classUid, objectId, body) {	
		
		return api.get(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/revisions")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)
	})

	factories.addFactory('get_all_objects', function(authtoken, api_key, classUid, body, tenant_uid) {	
		
		body 						= body || {}	
		body["_method"] = "GET"

		var call = api.post(config.endpoints.classes + "/" + classUid + "/" + "objects")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)

			if(tenant_uid)
				call.set('tenant_uid', tenant_uid)

		return call 
	})


	factories.addFactory('update_object', function(authtoken, api_key, classUid, objectId, body, query) {
		
		body  = body || {}
		query = query || {}
		
		return api.put(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/" + objectId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.query(query)
	})

	
	factories.addFactory('delete_object', function(authtoken, api_key, classUid, objectId) {
		
		return api.delete(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/" + objectId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('update_preserve_version', function(authtoken, api_key, classUid, objectId, body) {
		
		return api.put(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/" + objectId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('preserve_version', true)
			.set('application_api_key', api_key)
			.send(body)
	})

	
	factories.addFactory('object_revert', function(authtoken, api_key, classUid, objectUid, tenant_uid, body) {

		return api.post(config.endpoints.classes + "/" + classUid + "/" + "objects/" + objectUid + "/revert")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.set('tenant_uid', tenant_uid || "")
			.send(body)
	})


	factories.addFactory('update_metadata', function(authtoken, api_key, classUid, objectId, body) {
		
		return api.put(config.endpoints.classes + "/" + classUid + "/" + "objects" + "/" + objectId + "/" + "metadata")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})

	
	factories.addFactory('create_objects', function(count, authtoken, api_key, classUid, body, tenant_uid){
		
		body = body || []

		var promises = R.times(function(index){
			return function(){
				return R.Promisify(factories.create('Create_object', authtoken, api_key, classUid, {object:body[index]}, tenant_uid))
				.delay(100)
				.then(function(res){
					return res.body
				})		
			}
		}, count)

		return R.Promise.sequence(promises)
	})



	// factories.addFactory('update_object_multiple', function(count, authtoken, api_key, classUid, objectId, body){
	// 	var Name = R.bltRandom(3)
	// 	var promises   = R.times(function(index){
	// 		return R.Promisify(factories.create('Create_object', authtoken, api_key, classUid, objectId, {
	// 				"object": {
	// 					"name": Name,
	// 					"tags": [
	// 						"test"
	// 					]
	// 				}
	// 			}))
	// 		.then(function(res){
	// 			return res.body
	// 		})
	// 	}, count)

	// 	return R.Promise.all(promises)
	// })

	// Abhijeet 

	// factories.addFactory('create_objects', function(count, authtoken, api_key, classUid, body){
	// 	var objectName = R.bltRandom(3)
	// 	var promises   = R.times(function(index){
	// 		return R.Promisify(factories.create('Create_object', authtoken, api_key, classUid, {
	// 				"object": {
	// 					"name": R.bltRandom(3),
	// 					"tags": [
	// 						"test"
	// 					]
	// 				}
	// 			}))
	// 		.then(function(res){
	// 			return res.body
	// 		})
	// 	}, count)

	// 	return R.Promise.all(promises)
	// })







//---------------- (CMS) bulk sys acl
	
	factories.addFactory('apply_bulk_sys_acl', function(authtoken, api_key, body) {

		body = body || { }

		return api.post(config.endpoints.classesBulkAcl)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})	

	
	factories.addFactory('get_bulk_sys_acl', function(authtoken, api_key, body) {

		body = body || { }

		return api.get(config.endpoints.classesBulkAcl)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)
	})

	
	factories.addFactory('set_role_collaborator', function(authtoken, api_key, body) {

		body = body || {}
		
		return api.post(config.endpoints.applications + "/" + api_key + config.endpoints.collaboratorRole)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('get_permissions_user', function(authtoken, api_key, body) {
		
		body = body || { }
		
		return api.get(config.endpoints.applications + "/" + api_key + config.endpoints.userPermissions)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(body)
	})


	factories.addFactory('set_role_bulk_acl', function(authtoken, api_key, body) {

		body = body || {}
		
		return api.post(config.endpoints.system_roles_Bulk_acl)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


//---------------- tenants

	factories.addFactory('Create_tenants', function(authtoken, api_key, body) {

		var uid = R.bltRandom(4)
		var name = R.bltRandom(4)

		body = body || {
			"tenant": {
				"uid": uid,
				"name": name,
				"description": "supertest tenant is created by supertest"
			}
		}

		return api.post(config.endpoints.tenants)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})

	factories.addFactory('Get_tenants_list', function(authtoken, api_key) {

		return api.get(config.endpoints.tenants)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('update_tenant', function(authtoken, api_key, tenantId, body) {

		body = body || {
			"tenant": {
				"description": "updated by supertest"
			}
		}

		return api.put(config.endpoints.tenants + "/" + tenantId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})

	factories.addFactory('Get_single_tenant', function(authtoken, api_key, tenantGet, body) {

		return api.get(config.endpoints.tenants + "/" + tenantGet)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('delete_tenant', function(authtoken, api_key, tenantId, body) {

		return api.delete(config.endpoints.tenants + "/" + tenantId)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})

//---------------- Installation data
	
	factories.addFactory('Get_Installation_objects', function(authtoken, api_key) {

		return api.get(config.endpoints.installationsObject)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('Get_single_object', function(authtoken, api_key, objectUid) {

		return api.get(config.endpoints.installationsObject + "/" + objectUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})


	factories.addFactory('Create_Installation_object', function(authtoken, api_key, body) {

		body = body || {
			"object": {
				"published": true,
				"__loc": null,
				"device_type": "ios",
				// "device_token": "740f4707 bebcf74f 9b7c25d4 8e335894 5f6aa01d a5ddb387 462c7eaf 61bb78ad",
				"device_token": R.bltRandom(8),
				"subscribed_to_channels": [
					"object.create",
					"object.delete"
				],
				"badge": 1,
				"disable": false,
				"timezone": "+05:30",
				"credentials_name": "swapnil shirke",
				"ACL": {
					"disable": false,
					"others": {
						"read": false,
						"update": false,
						"delete": false
					}
				},
				"tags": [
					"supertest object"
				]
			}
		}

		return api.post(config.endpoints.installationsObject)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Update_Installation_object', function(authtoken, api_key, objectUid, body) {

		body = body || {}

		return api.put(config.endpoints.installationsObject + "/" + objectUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('Delete_Installation_object', function(authtoken, api_key, objectUid, body) {

		return api.delete(config.endpoints.installationsObject + "/" + objectUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})

//---------------- Application user role 

	factories.addFactory('Create_app_user_role', function(authtoken, api_key, body) {

		body = body || {
			"object": {
				"name": "testRole_facories"
			}
		}

		return api.post(config.endpoints.app_user_role_object)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	}) 

	
	factories.addFactory('get_app_user_roles', function(authtoken, api_key, body) {

		return api.get(config.endpoints.app_user_role_object)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})

	
	factories.addFactory('get_single_role', function(authtoken, api_key, roleid, body) {
		
		return api.get(config.endpoints.app_user_role_object + "/" + roleid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})

	
	factories.addFactory('update_app_user_role', function(authtoken, api_key, roleUid, body) {

		body = body || {}

		return api.put(config.endpoints.app_user_role_object + "/" + roleUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})


	factories.addFactory('delete_role', function(authtoken, api_key, roleid, body) {
		
		return api.delete(config.endpoints.app_user_role_object + "/" + roleid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
	})

//---------------- Application users registration

	factories.addFactory('create_app_user_object', function(authtoken, api_key, body) {
		
		body = body || { }
				
		return api.post(config.endpoints.app_user_object)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	}) 

	
	factories.addFactory('get_app_user_objects', function(authtoken, api_key, body, query) {
		
		body  = body || { }
		query = query || { }
		
		return api.get(config.endpoints.app_user_object)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.query(query)
			.send(body)
			.expect(200)

	})

	factories.addFactory('get_object_app_user', function(authtoken, api_key, appuserUid, body) {
		
		body = body || { }
		
		return api.get(config.endpoints.app_user_object + "/" + appuserUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	})

	factories.addFactory('update_object_app_user', function(authtoken, api_key, appuserUid, body) {
		
		body = body || { }
		
		return api.put(config.endpoints.app_user_object + "/" + appuserUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})

	factories.addFactory('delete_object_app_user', function(authtoken, api_key, appuserUid) {
		
		return api.delete(config.endpoints.app_user_object + "/" + appuserUid)
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.expect(200)
	})

	// -----------------

	factories.addFactory('register_app_user', function(api_key, body) {
		
		body = body || { }
				
		return api.post(config.endpoints.applicationUser)
			.set('application_api_key', api_key)
			.send(body)
	}) 

	factories.addFactory('login_app_user', function(api_key, body, tenant_uid) {
		
		body = body || { }
				
		var call = api.post(config.endpoints.appUser_login)
			.set('application_api_key', api_key)
			.send(body)

			if(tenant_uid)
				call.set('tenant_uid', tenant_uid)

		return call	

	})

	factories.addFactory('logout_app_user', function(authtoken, api_key) {
		
		return api.delete(config.endpoints.appUser_logout)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
	})



	factories.addFactory('get_register_app_user', function(authtoken, api_key, appuserUid) {

		return api.get(config.endpoints.applicationUser + "/" + appuserUid)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
	}) 


	factories.addFactory('update_register_app_user', function(authtoken, api_key, appuserUid, body) {
		
		body = body || { }
		
		return api.put(config.endpoints.applicationUser + "/" + appuserUid)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})
	

	factories.addFactory('delete_register_app_user', function(authtoken, api_key, appuserUid) {
		
		return api.delete(config.endpoints.app_user_object + "/" + appuserUid)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.expect(200)
	})


	factories.addFactory('get_current_app_user', function(authtoken, api_key) {

		return api.get(config.endpoints.applicationUser + "/current")
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.expect(200)
	})


	factories.addFactory('app_user_retrieve_user_uid', function(api_key, body) {

		body = body || { }
		
		return api.post(config.endpoints.applicationUser + "/retrieve_user_uid")
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})


	factories.addFactory('app_user_token', function(master_key, api_key, appuserUid) {
		
		return api.get(config.endpoints.applicationUser + "/" + appuserUid + "/token")
			.set('application_api_key', api_key)
			.set('master_key', master_key)
			.expect(200)
	})


	factories.addFactory('activate_app_user', function(api_key, appuserUid, token) {
		
		return api.get(config.endpoints.applicationUser + "/" + appuserUid + "/activate/" + token)
			.set('application_api_key', api_key)
			.expect(200)
	})

	
	factories.addFactory('req_forgot_password', function(api_key, body) {
	
		body = body || { }
		
		return api.post(config.endpoints.reqResetPassword)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})


	factories.addFactory('reset_password_app_user', function(api_key, body) {

		body = body || { }
		
		return api.post(config.endpoints.reset_password)
			.set('application_api_key', api_key)
			.send(body)
			.expect(200)
	})

	
	factories.addFactory('validate_token_app_user', function(api_key, query) {
	
		query    = query || {}

		return api.get(config.endpoints.validateToken)
			.set('application_api_key', api_key)
			.query(query)
			.expect(200)
	})

//---------------- Uploads
 
 	factories.addFactory('create_upload', function(authtoken, api_key, filename, body, query) {
		
		filename = filename ||  'png_1.png'
		body     = body || ''
		query    = query || {}

		return api.post(config.endpoints.uploads)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.field('PARAM', body)
			.query(query)
			.attach('upload[upload]', config.resource_path + filename)
			.expect(201)
	})


	factories.addFactory('get_uploads', function(authtoken, api_key, query) {
		
		query    = query || {}

		return api.get(config.endpoints.uploads)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.query(query)
			.expect(200)
			
	})


	factories.addFactory('get_single_upload', function(authtoken, api_key, uploadUID) {
		
		return api.get(config.endpoints.uploads + "/" + uploadUID)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.expect(200)
	})

	factories.addFactory('update_upload', function(authtoken, api_key, uploadUID, filename, body) {
		
		filename = filename ||  'png_1.png'
		body     = body || {}
		
		return api.put(config.endpoints.uploads + "/" + uploadUID)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.send(body)
			.attach('upload[upload]', config.resource_path + filename)
	})

	factories.addFactory('delete_upload', function(authtoken, api_key, uploadUID, body) {
		
		body     = body || {}
		
		return api.delete(config.endpoints.uploads + "/" + uploadUID)
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.send(body)
	})

	factories.addFactory('get_uploads_images', function(authtoken, api_key, query) {
		
		query    = query || {}

		return api.get(config.endpoints.uploads + "/images")
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.query(query)
			.expect(200)
			
	})

	factories.addFactory('get_uploads_videos', function(authtoken, api_key, query) {
		
		query    = query || {}

		return api.get(config.endpoints.uploads + "/videos")
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.query(query)
			.expect(200)
			
	})

	factories.addFactory('get_upload_tags', function(authtoken, api_key) {
		
		return api.get(config.endpoints.uploads + "/tags")
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.expect(200)
			
	})


	factories.addFactory('get_default_acl', function(authtoken, api_key) {
		
		return api.get(config.endpoints.uploads + "/default_acl")
			.set('application_api_key', api_key)
			.set('authtoken', authtoken)
			.expect(200)
			
	})

	factories.addFactory('set_default_acl', function(authtoken, api_key, body) {

		body = body || { }

		return api.post(config.endpoints.uploads + "/default_acl")
			.set('web_ui_api_key', config.web_ui_api_key)
			.set('authtoken', authtoken)
			.set('application_api_key', api_key)
			.send(body)
	}) 