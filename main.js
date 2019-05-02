const API = 'https://test-users-api.herokuapp.com/';
let users = [];


const getUsers = () => {
	return fetch(API + 'users').then(res => {
		return res.json();
	}).then(user => {
		return user.data;
	}).catch(err => {
		alert('oops! I couldnt get users', err)
	})
};

const deleteUser = async(userId, userEl) => {
	try {
		await fetch(API + "users/" + userId, {
			method: "DELETE"
		});
		users = users.filter((users) => users.id !== userId);
		userEl.remove();
	} catch(err) {
		console.log("nope! u can't do this sh#t!", err);
	}
}

const renderUsers = () => {
	const container = document.querySelector('.all-users');
	container.innerHTML = '';

	users.forEach(users => {
		const userCart = document.createElement('div');
		userCart.classList.add('user-cart');
		if ( users.age <= 99 ) {
			userCart.innerHTML = `
			<img src="https://randomuser.me/api/portraits/thumb/men/${users.age}.jpg" class="user-img" />
			<input type="text" value="${users.name}" class="user-cart_content nameid-${users.id}" required>
			<input type="text" value="${users.age}" class="user-cart_content ageid-${users.id}" required>
			`;
		} else {
			userCart.innerHTML = `
			<img src="plita.jpg" class="bad-news-img user-img" />
			<input type="text" value="${users.name}" class="user-cart_content nameid-${users.id}" required>
			<input type="text" value="${users.age}" class="user-cart_content ageid-${users.id}" required>
			`;
		}

		const deleteUserBtn = document.createElement('button');
		deleteUserBtn.classList.add('delete-user-btn');
		deleteUserBtn.textContent = 'Delete';
		deleteUserBtn.addEventListener('click', () => {deleteUser(users.id, userCart)});

		const changeUserBtn = document.createElement('button');
		changeUserBtn.classList.add('save-user-btn');
		changeUserBtn.textContent = 'Save';
		changeUserBtn.addEventListener('click', () => {saveChage(users.id)});

		const changeUserBtnCont = document.createElement('div');
		changeUserBtnCont.classList.add('change-btn-cont');

		changeUserBtnCont.append(changeUserBtn);
		changeUserBtnCont.append(deleteUserBtn);
		userCart.append(changeUserBtnCont)
		container.append(userCart);
	});
}

const loadUsers = async () => {
	users = await getUsers();
	renderUsers();
}
const saveChage = (updateId) => {
	updatedName = document.querySelector('.nameid-' + updateId).value;
	updatedAge = document.querySelector('.ageid-' + updateId).value;
	if ((updatedName.length === 0) || (updatedAge.length === 0)) {
		return;
	}
	fetch(API + "users/" + updateId, {
		method: "PUT",
		body: JSON.stringify({name: updatedName,age: updatedAge}),
		headers: {"Accept": 'application/json', "Content-Type": 'application/json'}
	}).then(res => res)
}


const createUser = () => {
	const name = document.querySelector('#name').value;
	const age = document.querySelector('#age').value;

	if ((name.length === 0) || (age.length === 0)) {
		return;
	}
	fetch(API + "users/", {
		method: "POST",
		body: JSON.stringify({name: name,age: age}),
		headers: {"Accept": 'application/json',"Content-Type": 'application/json'}
	}).then(res => {
		return res.json();
	}).then(({id}) => {
		const user = {name, age, id};
		users.unshift(user);
		renderUsers();

		document.querySelector('#name').value = '';
		document.querySelector('#age').value = '';
	})
	.catch(err => {
		console.log('nope!', err);
	})
}

document.addEventListener('DOMContentLoaded', () => {
	const loadBtn = document.querySelector('#load-users');
	loadBtn.addEventListener('click', loadUsers);

	const createUserBtn = document.querySelector('#create-user-button');
	createUserBtn.addEventListener('click', createUser);
});