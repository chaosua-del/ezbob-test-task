import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import Main from '../pages/Main';

describe('Testing Main page', () => {
  test('Should render main', () => {
    render(<Main />);
  });
});
