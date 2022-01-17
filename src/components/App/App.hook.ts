import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { rfInstanceToYaml } from 'services/rfinstance'

// @ts-ignore
export const useFile = (fileHandler, setFilehandler, rfInstance) => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let keys: Array<string> = []
    document.onkeydown = async (event) => {
      if (keys.length === 2) {
        keys = keys.slice(1)
      }
      keys.push(event.key)
      const combo = keys.join('-')
      const combos = ['Meta-s', 'Meta-o', 'Control-o', 'Control-s', 'Control-k', 'Meta-k']
      if (combos.includes(combo)) {
        event.preventDefault()
        keys = []
      }
      if (combo === 'Control-o' || combo === 'Meta-o') {
        console.log('> open')
        const options = {
          types: [
            {
              description: 'Text',
              accept: { 'text/*': ['.txt', '.yaml', '.yml', '.excalidraw'] },
            },
          ],
          multiple: false,
        }
        // @ts-ignore
        const [_fileHandler] = await window.showOpenFilePicker(options)
        if (_fileHandler.kind !== 'file') {
          toast.error('Could not open file')
          return
        }
        const file = await _fileHandler.getFile()
        const extension = file.name.split('.').pop()
        const _content = await file.text()

        if (extension === 'excalidraw') {
          const _newContent = JSON.parse(_content)
            .elements.filter((x: { type: string }) => x.type === 'text')
            .map((t: { text: string }) => t.text)
            .filter((t: string) => t.indexOf('- id:') === 0)
            .join('\n')
          setContent(_newContent)
        } else {
          setContent(_content)
        }
        setFilehandler(_fileHandler)

        toast.success('Loaded')
      } else if (combo === 'Control-s' || combo === 'Meta-s') {
        console.log('> save')
        try {
          if (!rfInstance) {
            toast.error('There are no tickets export')
            throw Error('There are no tickets export')
          }

          const file = await fileHandler.getFile()
          const extension = file.name.split('.').pop()

          if (extension === 'excalidraw') {
            const names = file.name.split('.')
            names.pop()
            const newName = names.join('.') + '.yml'
            const options = {
              types: [
                {
                  description: newName,
                  accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
                },
              ],
            }

            // @ts-ignore
            const newFileHandler = await window.showSaveFilePicker(options)
            // @ts-ignore
            const writableStream = await newFileHandler.createWritable()
            await writableStream.write(rfInstanceToYaml(rfInstance))
            writableStream.close()
            toast.success('Saved!')
            setFilehandler(newFileHandler)

            return
          }

          // @ts-ignore
          const writableStream = await fileHandler.createWritable()
          await writableStream.write(rfInstanceToYaml(rfInstance))
          writableStream.close()
          toast.success('Saved!')
        } catch (e) {
          console.error(e)
          toast.error('Uh oh, something went wrong.')
        }
      }
    }
  }, [setContent, setFilehandler, fileHandler, rfInstance])

  return [content]
}
