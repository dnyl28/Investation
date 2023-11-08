const User = require("../models/User");

async function seedUser() {
	// Seed Admin
	{
		let newUser = new User();
		newUser.role = 1;
	
		newUser.email = "admin@gmail.com";
		newUser.userName = "admin";
		newUser.firstName = "admin";
		newUser.lastName = "admin";
	
		newUser.setPassword("1234");
		newUser.isEmailVerified = true;
		newUser.isPhoneVerified = true;
		newUser.isProfileCompleted = true;
		newUser.status = 1;

		await newUser.save();
	}
	//agent
	{
		let newUser = new User();
		newUser.role = 2;
		
		newUser.email = "agent@gmail.com";
		newUser.userName = "agent";
		newUser.firstName = "agent";
		newUser.lastName = "agent";
	
		newUser.setPassword("1234");
		newUser.isEmailVerified = true;
		newUser.isPhoneVerified = true;
		newUser.isProfileCompleted = true;
		newUser.status = 1;

		await newUser.save();
	}
	//user
	{
		let newUser = new User();
		newUser.role = 3;
		
		newUser.email = "user@gmail.com";
		newUser.userName = "user";
		newUser.firstName = "user";
		newUser.lastName = "user";
		
		newUser.setPassword("1234");
		newUser.isEmailVerified = true;
		newUser.isPhoneVerified = true;
		newUser.isProfileCompleted = true;
		newUser.status = 1;

		await newUser.save();
	}
	console.log("Default Users Seeded");
}

module.exports = seedUser;
