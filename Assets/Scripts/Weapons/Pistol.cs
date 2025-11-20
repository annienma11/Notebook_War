using UnityEngine;

namespace NotebookWar.Weapons
{
    public class Pistol : WeaponBase
    {
        protected override void Fire()
        {
            base.Fire();
            // Add pistol-specific effects here (muzzle flash, sound, etc.)
            Debug.Log($"Pistol fired! Ammo: {currentAmmo}/{weaponData.magazineSize}");
        }
    }
}
