const fs = require('fs');

function getShadows(n) {
    let s = '';
    for (let i = 0; i < n; i++) {
        s += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
        if (i < n - 1) s += ', ';
    }
    return s;
}

const shadows1 = getShadows(700);
const shadows2 = getShadows(200);
const shadows3 = getShadows(100);

const css = `
/* Starfield Animations */
@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
}

.stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: ${shadows1};
  animation: animStar 50s linear infinite;
}

.stars:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: ${shadows1};
}

.stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: ${shadows2};
  animation: animStar 100s linear infinite;
}

.stars2:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: ${shadows2};
}

.stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: ${shadows3};
  animation: animStar 150s linear infinite;
}

.stars3:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: ${shadows3};
}
`;

fs.writeFileSync('stars.css', css);
console.log('stars.css generated');
