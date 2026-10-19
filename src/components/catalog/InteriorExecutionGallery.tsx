import items from '@/data/interior-execution.json'
import type { WorksPhoto } from '@/components/ui/WorksLightbox'
import { InteractivePhotoGallery } from '@/components/ui/InteractivePhotoGallery'

const photos = items.items as WorksPhoto[]

export function InteriorExecutionGallery() {
  return (
    <section className="interior-execution" aria-labelledby="interior-execution-title">
      <div className="interior-execution-header">
        <div>
          <h2 id="interior-execution-title">Варианты внутреннего исполнения</h2>
          <p>{items.description}</p>
        </div>
      </div>
      <InteractivePhotoGallery photos={photos} compact ariaLabel="Галерея вариантов внутреннего исполнения" />
    </section>
  )
}
