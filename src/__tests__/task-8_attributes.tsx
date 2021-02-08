import React from '../react';
import ReactDOM from '../react-dom';
import { getExampleDOM } from '../test-utils';

test('Check rendering with an html prop', async () => {
  const container = getExampleDOM();

  ReactDOM.render(
    <input value='Hello world' />,
    container
  );

  expect(container.querySelector('input').value).toBe('Hello world');
});
