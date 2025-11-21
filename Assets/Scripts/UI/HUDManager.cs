using UnityEngine;
using UnityEngine.UI;
using TMPro;
using NotebookWar.Player;
using NotebookWar.Weapons;

namespace NotebookWar.UI
{
    public class HUDManager : MonoBehaviour
    {
        [Header("Health & Armor")]
        [SerializeField] private Slider healthBar;
        [SerializeField] private Slider armorBar;
        
        [Header("Ammo Display")]
        [SerializeField] private TextMeshProUGUI ammoText;
        
        [Header("Weapon Display")]
        [SerializeField] private TextMeshProUGUI weaponNameText;
        
        [Header("Crosshair")]
        [SerializeField] private Image crosshair;
        
        [Header("Objective")]
        [SerializeField] private TextMeshProUGUI objectiveText;

        private PlayerController player;
        private WeaponSwitcher weaponSwitcher;

        private void Start()
        {
            player = FindObjectOfType<PlayerController>();
            weaponSwitcher = FindObjectOfType<WeaponSwitcher>();
        }

        private void Update()
        {
            UpdateHealthBar();
            UpdateArmorBar();
            UpdateAmmoDisplay();
            UpdateWeaponDisplay();
        }

        private void UpdateHealthBar()
        {
            if (player == null || healthBar == null) return;
            
            float healthPercent = player.GetCurrentHealth() / player.GetMaxHealth();
            healthBar.value = healthPercent;
        }

        private void UpdateArmorBar()
        {
            if (player == null || armorBar == null) return;
            
            float armorPercent = player.GetCurrentArmor() / player.GetMaxArmor();
            armorBar.value = armorPercent;
        }

        private void UpdateAmmoDisplay()
        {
            if (weaponSwitcher == null || ammoText == null) return;
            
            WeaponBase currentWeapon = weaponSwitcher.GetCurrentWeapon();
            if (currentWeapon != null)
            {
                ammoText.text = $"{currentWeapon.GetCurrentAmmo()}/{currentWeapon.GetMaxAmmo()}";
            }
        }

        private void UpdateWeaponDisplay()
        {
            if (weaponSwitcher == null || weaponNameText == null) return;
            
            weaponNameText.text = weaponSwitcher.GetCurrentWeaponName();
        }

        public void SetObjectiveText(string objective)
        {
            if (objectiveText != null)
                objectiveText.text = objective;
        }
    }
}