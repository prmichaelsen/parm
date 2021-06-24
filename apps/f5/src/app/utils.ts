import { environment } from '../environments/environment';

// only dev uses separate data collections.
// prod and qa share their data collections.
const app = environment.app;
const firebaseProjectId = 'com-f5-parm';

const ImagesStore = `${app}/images`;
const bucketName = `${firebaseProjectId}.appspot.com`;

/**
 * Produces a function which uses template strings to do simple interpolation from objects.
 * 
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
 * 
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 */
 export const generateTemplateString = (function(){
  var cache = {};

  function generateTemplate(template){
      var fn = cache[template];

      if (!fn){
          // Replace ${expressions} (etc) with ${map.expressions}.

          var sanitized = template
              .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
                  return `\$\{map.${match.trim()}\}`;
                  })
              // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
              .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

          fn = Function('map', `return \`${sanitized}\``);
      }

      return fn;
  }

  return generateTemplate;
})();

export const getImageUrl: ({filename: string}) => string = 
  generateTemplateString(`https://storage.googleapis.com/${bucketName}/${ImagesStore}/\${filename}`);