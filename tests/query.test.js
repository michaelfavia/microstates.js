import expect from 'expect';
import { create } from '../src/microstates';
import { valueOf } from '../src/meta';
import { map, filter, reduce } from '..';

import { TodoMVC } from './todomvc';

describe('A Microstate with queries', function() {
  let todomvc
  beforeEach(function() {
    let start = create(TodoMVC)
        .todos.push({title: "Take out The Milk"})
        .todos.push({title: "Convince People Microstates is awesome"})
        .todos.push({title: "Take out the Trash"})
        .todos.push({title: "profit $$"})

    let [ first ] = start.todos;
    let [,, third ] = first.toggle().todos;
    todomvc = third.toggle();

  });
  it('can partition an array microstate using filter', function() {
    let [ first, second, third, fourth ] = todomvc.todos;
    let [ firstCompleted, secondCompleted] = todomvc.completed;
    let [ firstActive, secondActive ] = todomvc.active;

    expect(todomvc.completed.length).toEqual(2)
    expect(valueOf(firstCompleted)).toEqual(valueOf(first))
    expect(valueOf(secondCompleted)).toEqual(valueOf(third))

    expect(todomvc.active.length).toEqual(2)
    expect(valueOf(firstActive)).toEqual(valueOf(second))
    expect(valueOf(secondActive)).toEqual(valueOf(fourth))
  });

  describe('invoking a transition from one of the object returned by a query.', function() {
    let next;
    beforeEach(function() {
      let [ first ] = todomvc.active;
      next = first.toggle()
    });
    it('has the desired effect on the original item', function() {
      let [, second] = next.todos;
      expect(second.completed.state).toEqual(true);
      expect(next.active.length).toEqual(1)
      expect(next.completed.length).toEqual(3)
    });
  });
});

describe('Query Array', () => {
  let array = [true, false, true];
  it('can reduce a regular array', () => {
    expect(reduce(array, (acc, bool) => bool ? ++acc : acc, 0)).toBe(2);
  });
  it('can map a regular array', () => {

    expect([...map(array, bool => !bool)]).toEqual([false, true, false]);
  });
  it('can filter a regular array', () => {
    expect([...filter(array, Boolean)]).toEqual([true, true]);
  });
});
