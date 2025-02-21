import Biren from '../../../assets/about/biren.png';
import Rashmi from '../../../assets/about/rashmi.png';
import Rajneesh from '../../../assets/about/rajneesh.png';
import Lokendar from '../../../assets/about/lokendar.png';
import Manvendra from '../../../assets/about/manvendra.png';
import Sahil from '../../../assets/about/sahil.png';
import Kavita from '../../../assets/about/kavita.png';
import Sumit from '../../../assets/about/sumit.png';

export const MeetTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Biren Kumar Nayak',
      designation: 'Tech Design Head',
      image: Biren,
    },
    {
      id: 2,
      name: 'Rashmi Chawla',
      designation: 'Administration Head',
      image: Rashmi,
    },
    {
      id: 3,
      name: 'Rajneesh',
      designation: 'Sr. Site Lead',
      image: Rajneesh,
    },
    {
      id: 4,
      name: 'Lokendar Singh',
      designation: 'Finance Functions Lead',
      image: Lokendar,
    },
    {
      id: 5,
      name: 'Manvendra Singh',
      designation: 'Sr Design Engineer',
      image: Manvendra,
    },
    {
      id: 6,
      name: 'Sahil Choudhary',
      designation: 'Senior Design Engineer (NPD)',
      image: Sahil,
    },
    {
      id: 7,
      name: 'Kavita Nair',
      designation: 'Senior Design Engineer (NPD)',
      image: Kavita,
    },
    {
      id: 8,
      name: 'Sumit Kumar',
      designation: 'Senior Design Engineer (NPD)',
      image: Sumit,
    },
  ];
  return (
    <div className='tw-mt-12 tw-grid tw-grid-cols-4 font tw-gap-4'>
      {teamMembers.map((teamMember) => (
        <div
          key={teamMember.id}
          className='tw-flex tw-flex-col tw-max-w-[220px]'
        >
          <img src={teamMember.image} alt='' className='w-[220px]' />
          <p className='tw-text-2xl'>{teamMember.name}</p>
          <p className='tw-text-sm'>{teamMember.designation}</p>
        </div>
      ))}
    </div>
  );
};
