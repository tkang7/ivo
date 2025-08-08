import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { DocRenderer } from '../components/DocRenderer'  // Fix import path

// Mock the DocRenderer component
vi.mock('../components/DocRenderer', () => ({  // Fix mock path
  DocRenderer: vi.fn(() => <div data-testid="doc-renderer">Rendered Document</div>)
}))

describe('App', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  it('handles successful data fetch - single document', async () => {
    const mockData = { id: 1, content: 'test' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData))
    })

    render(<App />)

    await waitFor(() => {
      expect(DocRenderer).toHaveBeenCalledWith(
        { node: mockData },
        undefined
      )
    })
  })

  it('handles successful data fetch - array of documents', async () => {
    const mockData = [{ id: 1, content: 'test' }, { id: 2, content: 'test2' }]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData))
    })

    render(<App />)

    await waitFor(() => {
      expect(DocRenderer).toHaveBeenCalledWith(
        { node: mockData[0] },
        undefined
      )
    })
  })

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Error Loading Contract')).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('handles HTTP error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Error Loading Contract')).toBeInTheDocument()
      expect(screen.getByText('HTTP error! status: 404')).toBeInTheDocument()
    })
  })

  it('retry button reloads the page', async () => {
    const user = userEvent.setup()
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    })

    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Contract')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Retry'))
    expect(reloadMock).toHaveBeenCalled()
  })
})