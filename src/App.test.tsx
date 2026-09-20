import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp'

describe('Tool Hub homepage', () => {
  it('shows Tool Hub branding, a short introduction, and one Countdown Timer card', () => {
    renderApp('/')

    expect(
      screen.getByRole('img', { name: /tool hub/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^tool hub$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/a collection of focused tools/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /precision tools for everyday focus/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/focused tools for everyday work/i),
    ).toBeInTheDocument()

    const tools = screen.getByRole('list', { name: /available tools/i })
    const links = within(tools).getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAccessibleName(/countdown timer/i)
    expect(links[0]).toHaveAttribute('href', '/countdown')
  })

  it('lets a user open the Countdown Timer from a tool card and return home', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(
      screen.getByRole('link', { name: /countdown timer/i }),
    )

    expect(
      screen.getByRole('heading', { name: /countdown timer/i }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', { name: /back to tool hub/i }),
    )

    expect(
      screen.getByRole('heading', { name: /^tool hub$/i }),
    ).toBeInTheDocument()
  })
})
