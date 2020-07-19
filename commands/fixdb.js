const fs = require('fs');
const mysql = require('mysql');
const { operator_id_one, operator_id_two } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { db_host, profile_user, profile_password, profile_db, profile_table, db_user, db_password, db_name, db_table} = require('../config.json');


module.exports = {
	name: 'fixdb',
	cooldown: 10,
	description: 'Displays Statistics of Vision Orb, usable only by HERO and HellFyre.',
	execute(message, args) {
		if(message.author.id === operator_id_one || message.author.id === operator_id_two){
			
			var con = mysql.createConnection({
				host: db_host,
				user: profile_user,
				password: profile_password,
				database: profile_db,
				multipleStatements: true
			});

			sql = "UPDATE "+profile_table+" SET fire_unit = 'misella_affh' WHERE fire_unit = 'misella_ffh'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET fire_unit = 'misella_tbb' WHERE fire_unit = 'misella_fmbf'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET earth_unit = 'cheria_bb' WHERE earth_unit = 'cheria_hh'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET water_unit = 'aegis_ltltw' WHERE water_unit = 'aegis_toftdn'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET water_unit = 'kanonno_gw' WHERE water_unit = 'kanonno_gb'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET light_unit = 'kanata_bos' WHERE light_unit = 'kanata_bcas'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET light_unit = 'kanata_bsis' WHERE light_unit = 'kanata_sswas'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET dark_unit = 'vicious_dp' WHERE dark_unit = 'vicious_ap'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
			sql = "UPDATE "+profile_table+" SET dark_unit = 'vicious_johl' WHERE dark_unit = 'vicious_swd'";
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				console.log("Sucessfully updated.");
			});
		}
	},
};