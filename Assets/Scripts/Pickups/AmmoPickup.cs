using UnityEngine;
using NotebookWar.Weapons;

namespace NotebookWar.Pickups
{
    public class AmmoPickup : PickupBase
    {
        [Header("Ammo Settings")]
        [SerializeField] private int ammoAmount = 30;
        [SerializeField] private WeaponType weaponType = WeaponType.Universal;
        
        public enum WeaponType
        {
            Universal,  // Works for all weapons
            Pistol,
            SMG,
            Rifle,
            Shotgun,
            Sniper,
            Grenade
        }

        protected override bool CanPickup(GameObject player)
        {
            // Check if player has the weapon and needs ammo
            WeaponSwitcher weaponSwitcher = player.GetComponent<WeaponSwitcher>();
            if (weaponSwitcher == null) return false;

            // For universal ammo, always allow pickup
            if (weaponType == WeaponType.Universal) return true;

            // Check specific weapon type
            WeaponBase targetWeapon = GetWeaponByType(weaponSwitcher);
            if (targetWeapon == null) return false;

            // Only pickup if not at max ammo (this would need ammo system expansion)
            return true;
        }

        protected override void ApplyEffect(GameObject player)
        {
            WeaponSwitcher weaponSwitcher = player.GetComponent<WeaponSwitcher>();
            if (weaponSwitcher == null) return;

            if (weaponType == WeaponType.Universal)
            {
                // Add ammo to current weapon
                WeaponBase currentWeapon = weaponSwitcher.GetCurrentWeapon();
                if (currentWeapon != null)
                {
                    AddAmmoToWeapon(currentWeapon);
                }
            }
            else
            {
                // Add ammo to specific weapon type
                WeaponBase targetWeapon = GetWeaponByType(weaponSwitcher);
                if (targetWeapon != null)
                {
                    AddAmmoToWeapon(targetWeapon);
                }
            }
        }

        private WeaponBase GetWeaponByType(WeaponSwitcher switcher)
        {
            // This would need to be implemented based on how weapons are organized
            // For now, return current weapon
            return switcher.GetCurrentWeapon();
        }

        private void AddAmmoToWeapon(WeaponBase weapon)
        {
            // This would need an ammo system expansion in WeaponBase
            // For now, just trigger reload if needed
            if (weapon.GetCurrentAmmo() == 0)
            {
                // Force reload or add reserve ammo
            }
        }
    }
}