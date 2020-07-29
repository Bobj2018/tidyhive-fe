import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { InviteConfirm } from './InviteConfirm';

let mock_path = '';
let mock_hash = 'TEST_HASH';
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({
    push: jest.fn((hist) => {
      mock_path = hist;
    }),
  })),
  useParams: jest.fn(() => ({
    hash: mock_hash,
  })),
}));

let mock_axiosWillPass = true;
let mock_post = jest.fn(() => {
  if (mock_axiosWillPass) {
    return Promise.resolve({
      data: { token: 'TEST_TOKEN' },
    });
  } else {
    return Promise.reject({ error: 'TEST_ERROR' });
  }
});

jest.mock('../../utils/AxiosWithAuth.js', () => () => ({
  post: mock_post,
}));

afterAll(cleanup);

describe('InviteConfirm component', () => {
  it('Renders', () => {
    let dimmer = render(<InviteConfirm />).getByTestId(/dimmer/);
    expect(dimmer).toBeVisible();
  });

  it('Calls the backend using hash', () => {
    jest.clearAllMocks();
    render(<InviteConfirm />);
    expect(mock_post).toHaveBeenCalledTimes(1);
    expect(mock_post).toHaveBeenCalledWith('/members/household/accept-invite', {
      hash: mock_hash,
    });
  });

  it('Moves to /household', () => {
    render(<InviteConfirm />);
    expect(mock_path).toBe('/household');
  });
});
