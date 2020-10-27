

const Employee = function(id,lastName,firstName,startDate,position) {
	this.lastName = lastName;
	this.firstName = firstName;
	this.id = id;
	this.startDate = startDate;
	this.position = position;
	this.calcSalary = function() {
		if(this.position === "Sếp"){
			return 5000;
		}
		if(this.position === "Trưởng phòng"){
			return 3000;
		}
		if(this.position === "Nhân viên"){
			return 1000;
		}
	}
}