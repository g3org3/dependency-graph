import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { rfInstanceToYaml } from './rfinstance.service'

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
              accept: { 'text/*': ['.txt', '.yaml', '.yml'] },
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
        const _content = await file.text()
        setContent(_content)
        setFilehandler(_fileHandler)
        toast.success('Loaded')
      } else if (combo === 'Control-s' || combo === 'Meta-s') {
        console.log('> save')
        try {
          if (!rfInstance) {
            toast.error('There are no tickets export')
            throw Error('There are no tickets export')
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
