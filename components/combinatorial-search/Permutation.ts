import { curry, allPass, anyPass } from 'ramda';

export class Permutation {
  static isEqual(collectionA, collectionB) {
    return [...collectionA].sort().join('-') === [...collectionB].sort().join('-');
  }
  static isIdentical(collectionA, collectionB) {
    return collectionA.join('-') === collectionB.join('-');
  }
  static search<T>(
    finder: (path: T[], solutions: T[][]) => T[],
    validator: (path: T[], solutions: T[][]) => boolean,
    concatFn = (_path: T[], _candidate: T): T[] => [..._path, _candidate],
    path: T[] = [],
    solutions: T[][] = []
  ): T[][] {
    // get candidates for current path
    const candidates = finder(path, solutions);

    // runs current path through validator to either get a new solution or nothing
    if (validator(path, solutions)) {
      solutions.push(path);
    }
    // if no candidates found, we cannot go deeper => either solution or dead end
    if (!candidates.length) {
      return solutions;
    }
    // go deeper
    return candidates.reduce(
      (_, candidate) => Permutation.search(finder, validator, concatFn, concatFn(path, candidate), solutions),
      []
    );
  }

  static connections<T>(items: T[], validator: (balls: T[]) => boolean, number = 2): T[][] {
    const isUnique = curry((collected: T[], ball: T) => !collected.includes(ball));
    const isValid = curry((collected: T[], ball: T) => !collected.length || validator([...collected, ball]));
    const isFull = (collected) => collected.length === number;
    const getNext = (collected) =>
      items.filter((item) => {
        return isUnique(collected, item) && (!isFull([...collected, item]) || isValid(collected, item));
        // allPass([isUnique(collected),isValid(collected)]);
      });
    const isNewSolution = (collected, solutions) =>
      !solutions.find((solution) => Permutation.isEqual(collected, solution));

    return Permutation.search<T>(
      (collected) => (isFull(collected) ? [] : getNext(collected)),
      (collected, solutions) => isFull(collected) && isNewSolution(collected, solutions)
    );
  }
}
