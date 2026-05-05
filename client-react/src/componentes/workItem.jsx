import { Link } from 'react-router-dom'
import './workItem.css'


export function WorkItem({ project_id, project_title, project_image, project_stack = "", project_description, project_collaborators }) {

  function formatCollaborators(str) {
    if (!str) return null;
    const list = str.split(',').map(c => c.trim());
    if (list.length === 1) return list[0];
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }
  
  return (
    <>
      <Link to={`/Work/${encodeURIComponent(project_title)}`} state={{ id: project_id }} className="work-item-link">
        <div className="main-container">
          
          
          <div className="bottom-half">
            
            <div className="bottom-left-quarter">
              <div className="info">
                <h2 className='projectTitle'>{project_title}</h2>
                 <div className="stack">
                  {project_stack && project_stack.split(",").map((stack, index) => (
                    <h2 key={index}>{stack.trim()}</h2>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bottom-right-quarter">
              {project_image && (
              <img 
                className="project_topimage"
                src={project_image} 
                alt={project_title} 
                
              />
            )}
              <p>{project_description}</p>
              {project_collaborators && <b className='collabs'>Collaboration with {formatCollaborators(project_collaborators)}</b>}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}