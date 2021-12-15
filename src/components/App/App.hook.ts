import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { rfInstanceToYaml } from './rfinstance.service'

// @ts-ignore
export const useFile = (fileHandler, rfInstance) => {
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
          toast.error('Could not open file')
          return
        }
        const file = await fileHandler.getFile()
        const content = await file.text()
        // @ts-ignore
        const notes: Array<NoteType> = yaml.loadAll(content)
        // dispatch(actions.setFileHandler({ fileHandler }))
        // dispatch(actions.replaceNotes({ notes }))
        toast.success('Loaded')
      } else if (combo === 'Control-s' || combo === 'Meta-s') {
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
  }, [fileHandler, rfInstance])
}
