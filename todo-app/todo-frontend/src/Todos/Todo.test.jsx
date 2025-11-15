import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    _id: "691870720fc8513cdd9dc29d",
    text: "Write code",
    done: true
  }

  render(<Todo todo={todo} doneInfo={(<></>)} notDoneInfo={(<></>)} />)

  const element = screen.getByText('Write code')
  expect(element).toBeDefined()
})