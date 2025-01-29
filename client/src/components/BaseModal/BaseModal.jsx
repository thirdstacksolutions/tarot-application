// import { Modal, Card } from '@mui/material';
// import PropTypes from 'prop-types';

// import './BaseModal.css';

// const BaseModal = ({ open, onClose, title, description, imageUrls, actions }) => {
//     return (
//         <Modal
//             open={open}
//             onClose={onClose}
//             aria-labelledby='modal-title'
//             aria-describedby='modal-description'>
//             <Card className='base-modal-card'>
//                 <div className='base-card-styling'>
//                     {/* Title */}
//                     {title && (
//                         <div className='modal-title'>
//                             <h2 className='custom-underline'>{title}</h2>
//                         </div>
//                     )}

//                     {/* Description */}
//                     {description && <p className='modal-description'>{description}</p>}

//                     {/* Image Section (Supports multiple images) */}
//                     {imageUrls?.length > 0 && (
//                         <div className='modal-img-container'>
//                             {imageUrls.map((url, index) => (
//                                 <img
//                                     key={index}
//                                     className={`modalImg ${index === 1 ? 'middleImg' : ''}`}
//                                     alt={`image${index + 1}`}
//                                     src={url}
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className='modal-actions'>
//                         {actions?.map((action, index) => (
//                             <button
//                                 key={index}
//                                 className={action.className || 'button'}
//                                 onClick={action.onClick}>
//                                 {action.label}
//                             </button>
//                         ))}
//                         <button
//                             className='button close-button'
//                             onClick={onClose}>
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             </Card>
//         </Modal>
//     );
// };

// BaseModal.propTypes = {
//     open: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     title: PropTypes.string,
//     description: PropTypes.string,
//     imageUrls: PropTypes.arrayOf(PropTypes.string),
//     actions: PropTypes.arrayOf(
//         PropTypes.shape({
//             label: PropTypes.string.isRequired,
//             onClick: PropTypes.func.isRequired,
//             className: PropTypes.string
//         })
//     )
// };

// export default BaseModal;
