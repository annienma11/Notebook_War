using UnityEngine;
using UnityEngine.UI;

namespace NotebookWar.UI
{
    public class DamageIndicator : MonoBehaviour
    {
        [SerializeField] private Image damageOverlay;
        [SerializeField] private float fadeSpeed = 2f;
        [SerializeField] private Color damageColor = new Color(1, 0, 0, 0.3f);
        
        private float damageAlpha = 0f;

        private void Update()
        {
            if (damageAlpha > 0)
            {
                damageAlpha -= fadeSpeed * Time.deltaTime;
                damageAlpha = Mathf.Max(0, damageAlpha);
                
                if (damageOverlay != null)
                {
                    Color color = damageColor;
                    color.a = damageAlpha;
                    damageOverlay.color = color;
                }
            }
        }

        public void ShowDamage()
        {
            damageAlpha = damageColor.a;
        }
    }
}