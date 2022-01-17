export const openAndChooseFile = async () => {
  const options = {
    types: [
      {
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
      },
    ],
    multiple: false,
  }

  // @ts-ignore
  const [fileHandler] = await window.showOpenFilePicker(options)

  if (fileHandler.kind !== 'file') {
    return Promise.reject('Could not open, because is not a file.')
  }

  const file = await fileHandler.getFile()
  const content = await file.text()

  return { fileHandler, content }
}

export const openAndSaveToFile = async (content: string) => {
  const options = {
    types: [
      {
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
      },
    ],
  }
  // @ts-ignore
  const fileHandler = await window.showSaveFilePicker(options)
  const writableStream = await fileHandler.createWritable()
  await writableStream.write(content)
  await writableStream.close()

  return fileHandler
}

// @ts-ignore
export const getFileName = (fileHandler) => {
  return fileHandler.name
}

// @ts-ignore
export const readFileContent = async (fileHandler) => {
  const file = await fileHandler.getFile()
  const content = await file.text()

  return content
}

// @ts-ignore
export const saveToFile = async (fileHandler, content) => {
  // @ts-ignore
  const writableStream = await fileHandler.createWritable()
  await writableStream.write(content)
  writableStream.close()
}
