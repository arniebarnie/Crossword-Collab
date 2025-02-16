import { render, screen } from '../utils/test-utils'
import Page from '@/app/page'

describe('Page', () => {
  it('renders the main heading', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
}) 