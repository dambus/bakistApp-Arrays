'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__value">
          ${mov}
        </div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const updateUI = acc => {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  inputTransferAmount.value = inputTransferTo.value = '';
};

createUsernames(accounts);

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //  Change focus
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const ammount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  console.log(ammount, recieverAcc);

  if (
    ammount > 0 &&
    recieverAcc &&
    currentAccount.balance >= ammount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-ammount);
    recieverAcc.movements.push(ammount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentAccount.username, currentAccount.pin);
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === Number(currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = '0';
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return Math.trunc(mov * eurToUsd);
// });

const movementsUSD = movements.map(mov => Math.trunc(mov * eurToUsd));

// console.log(movements);
// console.log(movementsUSD);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

// console.log(movementsDescriptions);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// console.log(movements);
// console.log(deposits);

// console.log(movements);

// accumulator is lake a snowball, it keeps getting bigger, adding all the movements
const balance = movements.reduce(function (acc, cur, i, arr) {
  // console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);

// console.log(balance);

// get max value
const maxMovement = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

// const eurToUsd = 1.1;
const totalDeposits = Math.round(
  movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0)
);

const totalWithdrawals = Math.round(
  Math.abs(
    movements
      .filter(mov => mov < 0)
      .map(mov => mov * eurToUsd)
      .reduce((acc, mov) => acc + mov, 0)
  )
);

console.log(totalDeposits);
console.log(totalWithdrawals);
// console.log(maxMovement);

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//coding challenge 2
// test data:
// const testData1 = [5, 2, 4, 1, 15, 8, 3];
// const testdata2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages => {
//   // console.log(ages);

//   const humanAges = ages.map(age => {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAges);

//   const filteredAges = humanAges.filter(age => {
//     return age >= 18;
//   });

//   const avrAdultAge = filteredAges.reduce((acc, ages) => {
//     // console.log(filteredAges.length);
//     return acc + ages;
//   }, 0);

//   // console.log(avrAdultAge);

//   return avrAdultAge / filteredAges.length;
// };

// console.log(calcAverageHumanAge(testData1));
// console.log(calcAverageHumanAge(testdata2));

// CODING CHALENGE 3

// const testData1 = [5, 2, 4, 1, 15, 8, 3];
// const testdata2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, ages, i, arr) => acc + ages / arr.length, 0);

// console.log(calcAverageHumanAge(testData1));
// console.log(calcAverageHumanAge(testdata2));

// console.log(movements);
// console.log(movements.includes(-130));

// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

// CHALLENGE #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
const allowedFood = function (dog) {
  return Math.round(dog.weight ** 0.75 * 28);
};

// 1.
const recommendedFood = function (dogs) {
  console.log(dogs);
  dogs.forEach(function (dog) {
    dog.food = Math.round(dog.weight ** 0.75 * 28);
    console.log();
  });
};
recommendedFood(dogs);
console.log(dogs);

//2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
const eatHow = function (dog) {
  // if(dog.food > dog.curFood) {
  //   console.log('')
  // }
  console.log(
    dog.food > dog.curFood
      ? 'Dog is eating too little'
      : 'Dog is eating too much'
  );
};
eatHow(dogSarah);
// console.log(allowedFood(dogs));
// console.log(recommendedFood(dogs));

//3.
// const ownersEatToMuch = [];
// const ownersEatTooLittle = [];

const ownersEatToMuch = dogs
  .filter(dog => dog.curFood > dog.food)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatToMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.food)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooLittle);

//4.
console.log(
  `${ownersEatToMuch.join(
    ' and '
  )} dogs eat to much and ${ownersEatTooLittle.join(' and ')} eat too little.`
);

//5.
const eatingExactly = dogs.some(dog => dog.curFood === dog.food);
console.log(eatingExactly);

//6.
const checkEatingOkay = dog =>
  dog.curFood > dog.food * 0.9 && dog.curFood < dog.food * 1.1;
console.log(dogs.some(checkEatingOkay));

//7.
const eaetingOkay = dogs.filter(checkEatingOkay);
console.log(eaetingOkay);

//8.
const dogsSorted = dogs.slice().sort((a, b) => a.food - b.food);
console.log(dogsSorted);
