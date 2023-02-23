import ranges from './ranges'

const findZipRange = (input, zipRanges) => {
  // false means invalid
  let pivot = 33;
  let start = 0;
  let end = 66;
  // section is the final value in zipRanges[pivot]. if pivot < section, it's either in the range of values of that array or an array before that one (or outside any range). 1 denotes the end value, while 0 denotes the start.
  const section = (pivot, position) => {
    let index = 0;
    if (position === 1) {
      if (typeof zipRanges[pivot - 1]) {
        index = zipRanges[pivot].length - 1;
      }
    }
    return zipRanges[pivot][index][position];
  };
  // 34470
  for (let i = 0; i < 4; i++) {
    do {
      // check if not in section
      if (input < section(pivot, 1)) {
        // personal note: why does below code exist?

        /*         if (typeof zipRanges[pivot + 1] !== 'undefined') {
          if (input > section(pivot + 1, 0)) {
            console.log('marco')
            return 'valid';
          }
        } */
        end = pivot;
        // if it's less than, needs to be > end value of previous section.
        if (typeof zipRanges[pivot - 1] !== 'undefined') {
          if (input > section(pivot - 1, 1)) {
            // check if in between sections
            // check if less than section pivot 0
            const secStart = section(pivot, 0);
            if (input <= secStart) {
              return false;
            }
            return pivot;
          }
        }
        pivot = Math.floor(pivot - (pivot - start) / 2);
      } else if (input > section(pivot, 1)) {
        start = pivot;
        // if greater, must be < start value of next section
        if (typeof zipRanges[pivot + 1] !== 'undefined') {
          const secStart = section(pivot + 1, 0);
          if (input <= secStart) {
            return false;
          }
        }
        pivot = Math.floor(pivot + (end - pivot) / 2);
        // if it matches an invalid zip, then it's definitely an invalid zip
      } else {
        return false;
      }
    } while (
      // Certain input values will make pivot be stuck on either start + 1 or end - 1. So break if that happens or if at start or end.
      pivot !== start + 1 &&
      pivot !== end - 1 &&
      pivot !== start &&
      pivot !== end
    );
    // when this code is reached, the loop will run one more time then either decrement or incriment the pivot and ron one last time.
    if (i > 1) {
      if (pivot === start + 1 && !pivot === end - 1) {
        pivot = --pivot;
      } else if (pivot === end - 1) {
        pivot = ++pivot;
      }
    }
  }
  return pivot;
};
const validateZip = (input) => {
  // zip codes can be anywhere from 00501 (parsed as 501) through 99950
  if (input < 501 || input > 99950) {
    return false;
  }
  // console.log(invalidRanges[49])
  const sectionId = findZipRange(input, ranges);
  // console.log(sectionId);
  if (sectionId || sectionId === 0) {
    const section = ranges[sectionId];
    // input falls within possible invalid range. find if in invalid range.
    // the last section is shorter than the rest, so will need to check the length
    let start = 0;
    let end = section.length - 1;
    let pivot = Math.floor((end - start) / 2);
    let invalid = false;
    // console.log(invalidZip.findIndex((zip) => zip === 44516))
/*     for (let i = invalidZip.findIndex((zip) => zip === '44516'); i < invalidZip.findIndex((zip) => zip === '46276'); i++) {
      const start = invalidZip.findIndex((zip) => zip === i);
      if (invalidZip[i] != parseInt(invalidZip[i - 1], 10) + 1) {
        console.log(invalidZip[i]);
      }
    }
    return false */
    // console.log(section);
    for (let i = 0; i < 3; i++) {
      for (let i = 0; i < 2; i++) {
        do {
          // console.log(start);
          // console.log(pivot);
          // console.log(end);
          // console.log(section[pivot]);
          // if less than end range
          if (input < section[pivot][1]) {
            // console.log('<');
            // if greater than start range, valid zip
            if (input > section[pivot][0]) {
              return true;
            }
            // not in range
            end = pivot;
            pivot = Math.floor(pivot - (end - start) / 2);
            // if greather than end range
          } else if (input > section[pivot][1]) {
            // console.log('>');
            // definitely not in that invalid range
            start = pivot;
            pivot = Math.floor(pivot + (end - start) / 2);
            // if matches invalid zip, definitely invalid
          } else {
            // console.log('invalid');
            invalid = true;
          }
        } while (
          pivot !== start + 1 &&
          pivot !== end - 1 &&
          pivot !== start &&
          pivot !== end &&
          !invalid
        ); // Certain input values will make pivot be stuck on either start + 1 or end - 1. So break if that happens or if at start or end.
        if (i === 1) {
          if (pivot === start + 1 || pivot === end) {
            pivot = --pivot;
          } else if (pivot === end - 1 || pivot === start) {
            pivot += 1;
          }
        }
        if (invalid) {
          break;
        }
      }
      if (invalid) {
        break;
      }
    }
  }
  return false;
};
export default validateZip;
