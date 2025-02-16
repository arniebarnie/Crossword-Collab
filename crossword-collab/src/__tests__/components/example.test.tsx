import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Example Component Test', () => {
  it('renders without crashing', () => {
    render(<div>Test Component</div>)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
}) 