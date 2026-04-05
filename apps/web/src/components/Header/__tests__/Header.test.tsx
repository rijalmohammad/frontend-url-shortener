import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../index';

describe('Header', () => {
  it('should render the application title', () => {
    render(<Header />);
    expect(screen.getByText('LinkShort')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Header />);
    expect(screen.getByText('Shorten links instantly')).toBeInTheDocument();
  });

  it('should have sticky header styling', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
    expect(header).toHaveClass('z-50');
  });

  it('should render the link icon', () => {
    const { container } = render(<Header />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have max-width constraint', () => {
    const { container } = render(<Header />);
    const contentDiv = container.querySelector('.max-w-4xl');
    expect(contentDiv).toBeInTheDocument();
  });
});