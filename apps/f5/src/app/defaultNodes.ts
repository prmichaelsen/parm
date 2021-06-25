import { Option } from './firebase';
import firebase from 'firebase';

const navText = `
<ListItem
  button
  component="a"
  aria-label="Create"
  href="/?focus=create"
>
  Create
</ListItem>
`

const navNode: Option = {
  children: [],
  creatorId: 'admin',
  parent: null,
  id: 'navigation',
  type: 'action',
  createTime: firebase.firestore.Timestamp.fromDate(new Date()),
  text: navText,
};

const defaultNodes = [
  navNode,
];

export default defaultNodes;