export function sumByProperty(array, propertyName) {
    return array.reduce((total, e) => total + e[propertyName], 0);
}

const seed = Math.random();
console.log(seed);
Math.seedrandom(`${seed}`);

export function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInteger(min, max) {
    return Math.floor(randomNumber(min, max));
}

export function randomItem(array) {
    return array[randomInteger(0, array.length)];
}

export function removeItem(array, item, inPlace = false) {
    const index = array.indexOf(item);
    if (index === -1) {
        return undefined;
    }
    if (!inPlace) {
        array = [...array];
    }
    return array.splice(index, 1)[0];
}

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

export function lastItem(array) {
    return array[array.length - 1];
}

export async function wait(millis) {
    return new Promise((resolve => setTimeout(resolve, millis)));
}

export function classNames(...className) {
    return className.filter((name) => !!name).join(' ');
}

export function stringifyJson(key, value) {
    if (value === null) {
        return null;
    } else if (value.stringify) {
        return value.stringify();
    }
    return value;
}

export function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, -x));
}

export function randomArray(length, min, max) {
    const a = [];
    for (let i = 0; i < length; i++) {
        a.push(randomNumber(min, max));
    }
    return a;
}

export function compareByParameter(parameter, asc = true) {
    if (asc) {
        return function (a, b) {
            if (a[parameter] === b[parameter]) {
                return 0;
            } else if (a[parameter] < b[parameter]) {
                return -1;
            } else {
                return 1;
            }
        }
    } else {
        return function (a, b) {
            if (a[parameter] === b[parameter]) {
                return 0;
            } else if (a[parameter] < b[parameter]) {
                return 1;
            } else {
                return -1;
            }
        }
    }
}
