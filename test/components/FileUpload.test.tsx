import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUpload from '../../src/components/FileUpload'

function createFile(name: string, type: string, size = 1024): File {
  return new File([new ArrayBuffer(size)], name, { type })
}

describe('FileUpload', () => {
  it('renderiza zona de carga vacía', () => {
    const onFile = vi.fn()
    render(<FileUpload onFile={onFile} />)
    expect(screen.getByText(/arrastra o haz clic/i)).toBeDefined()
  })

  it('llama onFile con el archivo al seleccionar', async () => {
    const onFile = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<FileUpload onFile={onFile} />)

    const file = createFile('doc.png', 'image/png')
    const input = container.querySelector('input[type="file"]')!
    await user.upload(input, file)

    expect(onFile).toHaveBeenCalledWith(file)
  })

  it('rechaza archivo con tipo inválido', async () => {
    const onFile = vi.fn()
    const { container } = render(<FileUpload onFile={onFile} />)

    const file = createFile('doc.jpg', 'image/gif')
    const input = container.querySelector('input[type="file"]')!
    fireEvent.change(input, { target: { files: [file] } })

    expect(onFile).toHaveBeenCalledWith(null)
    expect(screen.getByText(/solo se permiten/i)).toBeDefined()
  })

  it('rechaza archivo que excede 10 MB', async () => {
    const onFile = vi.fn()
    const { container } = render(<FileUpload onFile={onFile} />)

    const file = createFile('grande.jpg', 'image/jpeg', 11 * 1024 * 1024)
    const input = container.querySelector('input[type="file"]')!
    fireEvent.change(input, { target: { files: [file] } })

    expect(onFile).toHaveBeenCalledWith(null)
    expect(screen.getByRole('alert')).toHaveTextContent(/10 mb/i)
  })

  it('muestra preview cuando se pasa prop preview', () => {
    const onFile = vi.fn()
    render(<FileUpload onFile={onFile} preview="blob:http://test" />)
    const img = screen.getByAltText('Vista previa')
    expect(img).toBeDefined()
    expect(img).toHaveAttribute('src', 'blob:http://test')
  })

  it('permite eliminar archivo con botón', async () => {
    const onFile = vi.fn()
    const user = userEvent.setup()
    render(<FileUpload onFile={onFile} preview="blob:http://test" />)

    const removeBtn = screen.getByText('Eliminar archivo')
    await user.click(removeBtn)

    expect(onFile).toHaveBeenCalledWith(null)
  })

  it('muestra mensaje de error externo', () => {
    const onFile = vi.fn()
    render(<FileUpload onFile={onFile} error="Error externo" />)
    expect(screen.getByText('Error externo')).toBeDefined()
  })

  it('aplica clase dragging durante drag over', () => {
    const onFile = vi.fn()
    render(<FileUpload onFile={onFile} />)

    const zone = screen.getByLabelText('Subir archivo')
    fireEvent.dragOver(zone)
    expect(zone.className).toContain('border-blue-500')

    fireEvent.dragLeave(zone)
    expect(zone.className).not.toContain('border-blue-500')
  })

  it('procesa archivo soltado con drag & drop', () => {
    const onFile = vi.fn()
    render(<FileUpload onFile={onFile} />)

    const file = createFile('drop.png', 'image/png')
    const zone = screen.getByLabelText('Subir archivo')
    fireEvent.drop(zone, { dataTransfer: { files: [file] } })

    expect(onFile).toHaveBeenCalledWith(file)
  })
})
