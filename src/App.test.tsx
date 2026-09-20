import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp'

describe('Tool Hub homepage', () => {
  it('lets a user open the Countdown Timer from a tool card', async () => {
    const user = userEvent.setup()
    renderApp('/')

    expect(
      screen.getByRole('heading', { name: /tool hub/i }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', { name: /countdown timer/i }),
    )

    expect(
      screen.getByRole('heading', { name: /countdown timer/i }),
    ).toBeInTheDocument()
  })
})
