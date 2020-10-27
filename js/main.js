// Hệ thống quản lí nhân viên
// Người tạo: Đinh Quốc Đạt
// Chức năng:
// 1. Cho phép thêm nhân viên vào trong hệ thống
// 2. Hiển thị danh sách toàn bộ nhân viên ra màn hình
// 3. Xóa nhân viên khỏi hệ thống
// 4. Cập nhật thông tin của 1 nhân viên
// 5. Tìm kiếm nhân viên theo tên hoặc mã nhân viên
// 6. Validation dữ liệu

//Global
var empList = [];
//Funnction 2: Tìm nhân viên by ID
const findEmpByID = function(id) {
	for (var index = 0; index < empList.length; index++) {
		if(empList[index].id === id){
			return index;
		}
	}
	return -1;
};

//Function 1: Thêm nhân viên
const addEmp = function(){
	//input
	// process
	/**
	 * 	1. DOM tới html, lấy dữ liệu từ form
	 * 	2. tạo đối tượng nhân viên chứa dữ liệu lấy đc
	 * 	3. lưu đối tượng vào mảng emplList
	 * 	
	 */
	// dom theo id
	const lastName = document.getElementById("ho").value;
	const firstName = document.getElementById("ten").value;
	const id = document.getElementById("msnv").value;
	const startDate = document.getElementById("datepicker").value;
	const position = document.getElementById("chucvu").value;


	var isValid = true;
	//check validation 
	// nếu họ ko hợp lệ => isValid = true & false => isValid = false;
	isValid = isValid & checkRequired("ho", "lastNameError","*Vui lòng nhập họ");
	// 	 nếu tên ko hợp lệ => isValid = false & false => isValid = false;

	isValid = isValid & checkRequired("ten", "firstNameError","*Vui lòng nhập tên");

	isValid = isValid & checkRequired("msnv", "idError","*Vui lòng nhập mã");

	isValid = isValid & checkRequired("chucvu", "positionError","*Vui lòng chọn chức vụ");

	// form ko hợp lệ thì return luôn, chứ ko add nữa
	if(isValid ===0) return;

	//Check id trùng trong list
	const check = findEmpByID(id);

	if(check !== -1){
		alert("ID của nhân viên đã tồn tại");
		return;
	}
	const newEmp = new Employee(id,lastName,firstName,startDate,position);
	empList.push(newEmp);
	//Render giao diện
	renderEmp();
	console.log(empList);

	//SaveData in Local Storage
	saveData();
};
//Thêm sự kiện cho button trong js
//Callback function
//Hàm đóng vai trò là 1 tham số đầu vào trong 1 hàm khác thì gọi là callback function
// document.getElementById("addNew").addEventListener("click",addEmp);
const renderEmp = function (arr) {

	// nếu có truyền arr, thì dựa vào arr mà render giao diện
	//nếu ko mặc định arr là empList
	arr = arr || empList;
	//  " ", 0, false, undefined, null
	// var arr = 0 || empList => nghĩa là arr rỗng thì lấy empList 

	// <tr>
	// 	<td></td>
	// 	<td></td>
	// 	<td></td>
	// 	<td></td>
	// 	<td></td>
	// 	<td></td>
	// </tr>
	//Dấu `` (template string) cho phép bọc chuỗi và viết xuống dòng	
	//Cú pháp offer thêm biến vào chuỗi ${}
	var htmlContent = '';
	for (var index = 0; index < arr.length; index++) {
		const currentEmp = arr[index];
		htmlContent += `
		<tr>
		 	<td>${index+1}</td>
		 	<td>${currentEmp.lastName + " " + currentEmp.firstName}</td>
		 	<td>${currentEmp.id}</td>
		 	<td>${currentEmp.startDate}</td>
		 	<td>${currentEmp.position}</td>
			<td>${currentEmp.calcSalary()}</td>
			<td>
				<button class="btn btn-info rounded-circle" onClick="getUpdateEmp('${currentEmp.id}')">
					<i class="fa fa-edit"></i>
				</button>
				<button class="btn btn-danger rounded-circle" onClick="deleteEmp('${currentEmp.id}')">
					<i class="fa fa-trash"></i>
				</button>
			</td> 
		</tr>`
	}
	document.getElementById("tbodyEmp").innerHTML = htmlContent;
}

//function 3: Save data in Local Storage/Section Storage/Cookie
const saveData = function () {
	// setItem('Tên','loại gì');
	//Cast mảng -> chuỗi: JSON.stringify(Array);
	localStorage.setItem("empList",JSON.stringify(empList));
}

//function 4: LoadData in Local Storage
const getData = function () {
	var empListJson = localStorage.getItem("empList");
	if(!empListJson){
		return;
	}
	//Map từ bảng cũ [n1,n2,n3] -> [new Emp(1), new Emp(2), new Emp(3)]
	//Để lấy được hàm chạy
	const empListFromLocal = JSON.parse(empListJson);
	for (var index = 0; index < empListFromLocal.length; index++) {
		//n1
		const currentEmpl = empListFromLocal[index];
		//new Emp(1) Giống hoàn toàn n1 chỉ khác là có thể dùng được phương thức
		const newEmp = new Employee(currentEmpl.id,currentEmpl.lastName,currentEmpl.firstName,currentEmpl.startDate,currentEmpl.position);
		empList.push(newEmp);
	}

	//Cast chuỗi -> mảng
	// empList = JSON.parse(empListJson);
	// Tạo giao diện danh sách cũ
	renderEmp();
}
getData();

//function 5: Delete emp out ò list
const deleteEmp = function (id) {
	//Xóa phần tử bất kì splice
	//Gọi hàm findID để tìm ID muốn xóa
	const checkID = findEmpByID(id);
	if(checkID !== -1){
		empList.splice(checkID,1); //Tìm thấy -> Xóa
		saveData();
		renderEmp();//Update lại giao diện
	}
}

//function 6: Update emp
const getUpdateEmp = function (id) {
	//Lấy thông tin muốn chỉnh sửa hiện lên form
	//Tìm emp có trong danh sách
	const checkID = findEmpByID(id);
	if(checkID !== -1){
		//Đổ data ngược lại form
		document.getElementById("ho").value = empList[checkID].lastName;
		document.getElementById("ten").value = empList[checkID].firstName;
		document.getElementById("msnv").value = empList[checkID].id;
		document.getElementById("datepicker").value = empList[checkID].startDate;
		document.getElementById("chucvu").value = empList[checkID].position;

		//Chặn ô ID không cho edit
		//SetAttribute();
		document.getElementById("msnv").setAttribute('disabled',true);
		//Ẩn button thêm hiện button cập nhật
		document.getElementById("btnAdd").style.display = "none";
		document.getElementById("btnUpdate").style.display = "block";
	}
}	
//function 7: update empl
const updateEmpl = function(){
	// 1. Lấy thông tin mới sửa từ form ( DOM)
	const lastName = document.getElementById("ho").value;
	const firstName = document.getElementById("ten").value;
	const id = document.getElementById("msnv").value;
	const startDate = document.getElementById("datepicker").value;
	const position = document.getElementById("chucvu").value;
	// 2. id vẫn như cũ, tìm vị trí của nv có id này trong mảng
	const index = findEmpByID(id);

	if ( index !== -1){
		const updatedEmpl = new Employee(id,lastName,firstName,startDate,position);
		empList[index] = updatedEmpl; //index chính là vị trí muốn update
		renderEmp();
		
		// 3. tiến hành update
		// 3.1 emplList[index].lastName = lastName mới 
		// 3.2 tạo ra 1 đối tượng NV mới từ info mới: emplList[index] = employeeMoiUpdate

		// ẩn nút cập nhật, hiện lại nút add
		document.getElementById("btnAdd").style.display = "block";
		document.getElementById("btnUpdate").style.display = "none";

		// mở disabled của ô mã số nhân viên 
		document.getElementById("msnv").removeAttribute('disabled');

		// trigger nút reset nhấn
		document.getElementById('btnReset').click();

	}

}

// function 8: tìm nhân viên theo mã hoặc theo tên
const findEmpl = function(){
	const foundedEmpl = [];
	//1. lấy keyword người dùng nhập vào (DOM)
	const keyword = document.getElementById("txtSearch").value.trim().toLowerCase(); //trim() làm bỏ khoảng trống 2 đầu

	//2. tìm theo mã: lập for, kiểm tra từng nhân viên trong mảng, có nhân viên nào
	for ( var i =0; i< empList.length;i++){
		const currentEmp = empList[i];

		var fullName = currentEmp.lastName + " " + currentEmp.firstName;

		fullName = fullName.toLowerCase();

		if(currentEmp.id === keyword){
			foundedEmpl.push(currentEmp);
			break; // tìm đc id thì break;
		}

		if(fullName.indexOf(keyword) !== -1 ) //indexOf: kiểm tra keyword có nằm trong fullName không
		{
			foundedEmpl.push(currentEmp);
		}
	}
	// có id giống keyword không => push nv đó vào foundedEmpl
	//3. console.log(foundedEmpl);
	
	renderEmp(foundedEmpl); //truyền arr là mảng foundedEmpl 
	


};





//  --------VALIDATION FUNCTION---------------
const checkRequired = function(id, errorId, message){
	const value = document.getElementById(id).value;
	if(value){
		// user đã nhập
		document.getElementById(errorId).innerHTML="";

		return true;
	}
	// user chưa nhập
	document.getElementById(errorId).innerHTML= message;

	return false;

}













