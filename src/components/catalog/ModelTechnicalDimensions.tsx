import type { Home, Sauna } from '@/types'
import modelRoomAreaSources from '@/data/model-room-area-sources.json'

type RoomAreaSource = { status: 'explicit-room-areas' | 'plan-without-room-areas' | 'plan-unavailable'; plan: string | null; areas?: number[]; labelsOnPlan?: boolean }
const sources = modelRoomAreaSources as Record<string, RoomAreaSource>

/** Display only room areas explicitly printed as S values in that model's plan. */
export function ModelTechnicalDimensions({ model }: { model: Sauna | Home }) {
  const source = sources[model.id]
  const areas = source?.status === 'explicit-room-areas' ? source.areas ?? [] : []
  return <section className="model-room-areas" aria-labelledby={`room-areas-${model.id}`} data-model-room-areas={model.id} data-room-area-source={source?.status ?? 'missing-review'}>
    <h3 id={`room-areas-${model.id}`} className="text-sm font-semibold text-cream">Площади помещений по плану</h3>
    {areas.length > 0 ? <>
      <dl className="model-room-area-list">
        {areas.map((area, index) => <div key={`${model.id}-room-${index}`}><dt>Помещение {index + 1}</dt><dd>{area.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} м²</dd></div>)}
      </dl>
      {source?.labelsOnPlan === false && <p className="model-room-area-note">В исходном плане площади указаны без названий помещений; порядок соответствует отметкам S слева направо.</p>}
    </> : <p className="model-room-area-note">{source?.status === 'plan-unavailable' ? 'У модели пока нет подтверждённого исходника планировки. Помещения и их размеры согласуют по рабочему проекту.' : 'Точные площади отдельных помещений в доступном плане не указаны. Их уточняют по рабочему чертежу.'}</p>}
  </section>
}
