import React from 'react';
import { render, screen } from '@testing-library/react';
import CropImage from './CropImage';

describe('CropImage', () => {
  it('renders the component', () => {
    render(<CropImage />);

    // Assert that the component renders without throwing an error
    expect(screen.getByText('Crop')).toBeInTheDocument();
    expect(screen.getByText('Crop Image')).toBeInTheDocument();
    expect(screen.getByText('200 x')).toBeInTheDocument();
    expect(screen.getByText('1000 x')).toBeInTheDocument();
    expect(screen.getByText('900 x 735 pixels')).toBeInTheDocument();
    expect(screen.getByText('580 x 320 pixels')).toBeInTheDocument();
    expect(screen.getByText('Get Crop File')).toBeInTheDocument();
  });

  // Add more tests to cover the component's functionality
});
