using UnityEngine;
using UnityEngine.UI;
using NotebookWar.Weapons;

namespace NotebookWar.UI
{
    public class Crosshair : MonoBehaviour
    {
        [Header("Crosshair Settings")]
        [SerializeField] private Image crosshairImage;
        [SerializeField] private Color defaultColor = Color.white;
        [SerializeField] private Color enemyColor = Color.red;
        [SerializeField] private float fadeSpeed = 5f;
        
        private WeaponSwitcher weaponSwitcher;
        private Camera playerCamera;

        private void Start()
        {
            weaponSwitcher = FindObjectOfType<WeaponSwitcher>();
            playerCamera = Camera.main;
        }

        private void Update()
        {
            UpdateCrosshairColor();
        }

        private void UpdateCrosshairColor()
        {
            if (crosshairImage == null || playerCamera == null) return;

            // Raycast from center of screen to check for enemies
            Ray ray = playerCamera.ScreenPointToRay(new Vector3(Screen.width / 2, Screen.height / 2, 0));
            
            Color targetColor = defaultColor;
            if (Physics.Raycast(ray, out RaycastHit hit, 100f))
            {
                if (hit.collider.CompareTag("Enemy"))
                {
                    targetColor = enemyColor;
                }
            }

            crosshairImage.color = Color.Lerp(crosshairImage.color, targetColor, fadeSpeed * Time.deltaTime);
        }
    }
}